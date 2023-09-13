const { Tour, User, TourSite, Like, PlanDate, Invite } = require('../models');
const { Op } = require('sequelize');
const redisCli = require('./../utils/redis');
const Sequelize = require('sequelize');

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
        order: ['id', 'DESC'],
      });
      await redisCli.set('tour', JSON.stringify(data));
      await redisCli.expire('tour', 30);
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
  //좋아요 순으로 여행계획 조회하기
  getLikeList = async () => {
    let data = await Tour.findAll({
      include: [
        { model: User, attributes: ['nickname'] },
        { model: TourSite, attributes: ['site_name', 'site_address', 'site_img'] },
        {
          model: Like,
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likeCount']],
        },
      ],
      attributes: {
        include: [[Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likeCount']], //sequelize의 집계함수 COUNT를 사용하여 Likes.id 값을 합산
        //합산한 결과 값을 가상의 컬럼인 likeCount에 지정
        exclude: ['password'], //제외할 DB 필드명
      },

      group: ['Tour.id'], // 컬럼을 기준으로 데이터를 정렬 Tour.id별로 데이터들이 그룹화 되도록 설정
      order: [[Sequelize.literal('likeCount'), 'DESC']], //특정 컬럼 기준으로 데이터 정렬 합산한 likeCount 결과값을 DESC(내림차순으로 정렬)
    });

    return data;
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
      order: [['id', 'DESC']],
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
      order: [['id', 'DESC']],
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

  //임시 여행계획작성
  createTestTour = async ({ tour_site_id, user_id, title, start_date, end_date, status }) => {
    return await Tour.create({
      tour_site_id: tour_site_id,
      user_id: user_id,
      title,
      start_date,
      end_date,
      status: status,
    });
  };
}

module.exports = TourRepository;
