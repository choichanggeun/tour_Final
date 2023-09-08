const { Tour, User, TourSite, Like, PlanDate, Invite } = require('../models');
const { Op } = require('sequelize');
const redis = require('redis');
//Redis 실행
const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

class TourRepository {
  // 여행 계획 등록
  createTour = async ({ user_id, title, start_date, end_date, tour_site_id }) => {
    const user = await User.findOne({ where: { id: user_id } });

    const tourSite = await TourSite.findOne({ where: { id: tour_site_id } });
    if (!user) {
      throw new Error('해당하는 사용자가 없습니다.');
    }
    const createdTourData = await Tour.create({ title, start_date, end_date, user_id, tour_site_id, status: 0 });

    return createdTourData;
  };

  getTourOne = async (tour_id) => {
    return await Tour.findOne({ where: { id: tour_id } });
  };

  getTourList = async () => {
    let value = await redisCli.get('tour', 0, -1);
    if (value) {
      return JSON.parse(value);
    } else {
      let data = await Tour.findAll({
        where: { status: 1 },
        include: [
          { model: User, attributes: ['nickname'] },
          { model: TourSite, attributes: ['site_name', 'site_address', 'site_img'] },
        ],
      });
      await redisCli.set('tour', JSON.stringify(data));
      await redisCli.expire('tour', 30);
      return data;
    }
  };
  //좋아요 순으로 여행계획 조회하기
  getLikeList = async () => {
    let value = await redisCli.get('tour');
    if (value) {
      return JSON.parse(value);
    } else {
      let data = await Tour.findAll({
        include: [
          { model: User, attributes: ['nickname'] },
          { model: TourSite, attributes: ['site_name', 'site_address', 'site_img'] },
        ],
        attributes: ['id', 'title'], // 필요한 속성만 선택하여 가져옴
      });

      for (let i = 0; i < data.length; i++) {
        let likeCount = await Like.count({ where: { tour_id: data[i].id } });
        console.log(`Tour ID: ${data[i].id}, Like Count: ${likeCount}`);
        data[i].dataValues.likeCount = likeCount;
      }

      // 좋아요 많은 순서대로 정렬합니다.
      data.sort((a, b) => b.dataValues.likeCount - a.dataValues.likeCount);
      // Convert each Sequelize instance into a plain JavaScript object and include the likeCount property
      data = data.map((tour) => {
        return { ...tour.get(), likeCount: tour.dataValues.likeCount };
      });

      await redisCli.set('tour', JSON.stringify(data));

      return data;
    }
  };

  searchTour = async (search_data, search_type) => {
    if (search_type === '제목') {
      const findTour = await Tour.findAll({ where: { title: { [Op.like]: '%' + search_data + '%' } }, include: [{ model: User }, { model: TourSite }] });
      return findTour.map((tour) => {
        return {
          nickname: tour.User.nickname,
          title: tour.title,
          site_name: tour.TourSite.site_name,
          site_img: tour.TourSite.site_img,
        };
      });
    } else if (search_type === '사용자') {
      const findUser = await User.findAll({
        where: { nickname: { [Op.like]: '%' + search_data + '%' } },
        include: [
          {
            model: Tour,
            include: [
              {
                model: TourSite,
              },
            ],
          },
        ],
      });
      return findUser.map((user) => {
        return {
          nickname: user.nickname,
          title: user.Tours[0].title,
          site_name: user.Tours[0].TourSite.site_name,
          site_img: user.Tours[0].TourSite.site_img,
        };
      });
    }
  };

  // 모든 여행 계획 조회
  getUserTour = async (user_id) => {
    const tours = await Tour.findAll({
      where: {
        user_id: user_id,
      },
      attributes: ['id', 'title', 'start_date', 'end_date', 'user_id', 'tour_site_id'],
      include: [
        {
          model: TourSite,
          attributes: ['site_img'],
        },
      ],
    });
    const mapTours = tours.map((tour) => {
      return {
        id: tour.id,
        title: tour.title,
        start_date: tour.start_date,
        end_date: tour.end_date,
        site_img: tour.TourSite.site_img,
      };
    });

    const invitedTours = await Invite.findAll({
      where: { user_id: user_id },
      include: [{ model: Tour, include: [{ model: TourSite }] }],
    });

    const mapinvitedTours = invitedTours.map((tour) => {
      return {
        id: tour.Tour.id,
        title: tour.Tour.title,
        start_date: tour.Tour.start_date,
        end_date: tour.Tour.end_date,
        site_img: tour.Tour.TourSite.site_img,
      };
    });
    if (mapinvitedTours) {
      for (let i = 0; i < mapinvitedTours.length; i++) {
        mapTours.push(mapinvitedTours[i]);
      }
    }
    return mapTours;
  };
  // 여행 계획 수정
  updateTour = async (tour_id, title, start_date, end_date) => {
    const updatedTour = await Tour.update({ title, start_date, end_date }, { where: { id: tour_id } });
    if (updatedTour) {
      const oldDate = new Date(start_date);
      const newDate = new Date(end_date);
      let diff = Math.abs(newDate.getTime() - oldDate.getTime());
      diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const countDate = await PlanDate.count({ where: { tour_id: tour_id } });
      const necessaryDate = diff + 1 - countDate;
      if (necessaryDate > 0) {
        for (let i = 1; i < necessaryDate + 1; i++) {
          await PlanDate.create({ tour_id, day: countDate + i });
        }
      }
    }
    return updatedTour; // 업데이트 성공 여부 반환
  };

  // 여행 계획 삭제
  deleteTour = async ({ user_id, tour_id }) => {
    const deletedTour = await Tour.destroy({ where: { id: tour_id } });
    return deletedTour; // 삭제 성공 여부 반환
  };

  findTourInProgress = async (user_id) => {
    return await Tour.findOne({ where: { [Op.and]: [{ user_id: user_id }, { status: '0' }] } });
  };

  updateStatus = async (tour_id) => {
    return await Tour.update({ status: 1 }, { where: { id: tour_id } });
  };

  getVerifyTour = async (user_id, tour_id) => {
    return await Tour.findOne({ where: { user_id, id: tour_id } });
  };
}

module.exports = TourRepository;
