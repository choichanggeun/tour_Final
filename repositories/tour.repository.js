const { Tour, User, TourSite } = require('../models');
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
  searchTour = async (search_data, search_type) => {
    if (search_type === '제목') {
      return await Tour.findAll({ where: { title: { [Op.like]: '%' + search_data + '%' } } });
    } else if (search_type === '사용자') {
      return await User.findAll({ where: { nickname: { [Op.like]: '%' + search_data + '%' } } });
    }
  };
  // 모든 여행 계획 조회
  getTour = async (user_id, tour_site_id) => {
    const tours = await Tour.findAll({
      attributes: ['title', 'start_date', 'end_date', 'user_id', 'tour_site_id'],
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
