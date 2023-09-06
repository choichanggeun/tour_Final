const { Tour, User, TourSite, Like } = require('../models');
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
        include: [
          { model: User, attributes: ['nickname'] },
          { model: TourSite, attributes: ['site_name', 'site_address', 'site_img'] },
        ],
      });
      await redisCli.set('tour', JSON.stringify(data));
      await redisCli.expire('tour', 360);
      return data;
    }
  };

  //좋아요 순으로 여행계획 전체 조회
  getLikeList = async () => {
    let value = await redisCli.get('tour', 0, -1);
    if (value) {
      return JSON.parse(value);
    } else {
      let data = await Tour.findAll({
        include: [{ model: User, attributes: ['nickname'] }, { model: TourSite, attributes: ['site_name', 'site_address', 'site_img'] }, { model: Like }],
      });

      // 각 여행계획(Tour)이 가진 좋아요(Like)의 개수를 계산합니다.
      await Promise.all(
        data.map(async (tour) => {
          tour.dataValues.likeCount = await Like.count({ where: { tour_id: tour.id } });
        })
      );

      // 좋아요 많은 순서대로 정렬합니다.
      data.sort((a, b) => b.dataValues.likeCount - a.dataValues.likeCount);

      await redisCli.set('tour', JSON.stringify(data));
      await redisCli.expire('tour', 360);

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
    return tours;
  };
  // 여행 계획 수정
  updateTour = async ({ user_id, tour_id, title, content, start_date, end_date }) => {
    const updatedTour = await Tour.update({ title, content, start_date, end_date }, { where: { id: tour_id } });

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
}

module.exports = TourRepository;
