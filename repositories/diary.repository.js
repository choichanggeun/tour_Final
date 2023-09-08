const { User, Tour, Diary } = require('../models');
const { Op } = require('sequelize');

class DiaryRepository {
  // 여행 일지 작성
  postDiary = async (user_id, tour_id, title, content, status) => {
    await Diary.create({ user_id, tour_id, title, content, status });
  };

  // 여행 일지 조회
  getDiary = async (diary_id) => {
    return await Diary.findOne({ where: { id: diary_id }, include: [{ model: User, attributes: ['nickname'] }] });
  };

  // 내 모든 여행 일지 조회
  getMyDiaries = async (user_id) => {
    return await Diary.findAll({ where: { user_id }, include: [{ model: User, attributes: ['nickname'] }] });
  };

  // 여행 계획 여행 일지 조회
  getTourDiaries = async (tour_id) => {
    return await Diary.findAll({ where: { tour_id, status: 0 }, include: [{ model: User, attributes: ['nickname'] }] });
  };

  // 모든 여행 일지 조회
  getDiaries = async () => {
    return await Diary.findAll({ where: { status: 0 }, include: [{ model: User, attributes: ['nickname'] }] });
  };

  // 모든 여행 일지 조회(커서)
  getDiariesCursor = async (cursor) => {
    const queryOptions = {
      where: {
        status: 0,
      },
      include: [{ model: User, attributes: ['nickname'] }],
      limit: 16,
      order: [['id', 'DESC']],
    };
    if (cursor !== 'undefined') {
      queryOptions.where.id = {
        [Op.lt]: parseInt(cursor),
      };
    }
    return await Diary.findAll(queryOptions);
  };

  // 여행 일지 검색
  searchDiaries = async (cursor, search_data) => {
    const queryOptions = {
      where: {
        [Op.or]: [{ title: { [Op.like]: '%' + search_data + '%' } }, { content: { [Op.like]: '%' + search_data + '%' } }, { '$User.nickname$': { [Op.like]: '%' + search_data + '%' } }],
        status: 0,
      },
      include: [{ model: User, attributes: ['nickname'] }],
      limit: 16,
      order: [['id', 'DESC']],
    };
    if (cursor !== 'undefined') {
      queryOptions.where.id = {
        [Op.lt]: parseInt(cursor),
      };
    }
    return await Diary.findAll(queryOptions);
  };

  // 여행 일지 수정
  putDiary = async (diary_id, title, content, status) => {
    await Diary.update({ title, content, status }, { where: { id: diary_id } });
  };

  // 여행 일지 삭제
  deleteDiary = async (diary_id) => {
    await Diary.destroy({ where: { id: diary_id } });
  };

  // 여행 계획 조회
  getTour = async (tour_id) => {
    return await Tour.findOne({ where: { id: tour_id } });
  };
}

module.exports = DiaryRepository;
