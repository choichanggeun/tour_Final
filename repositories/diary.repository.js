const { Tour, Diary, DiaryPhoto } = require('../models');

class DiaryRepository {
  // 여행 일지 작성
  postDiary = async (user_id, tour_id, title, content) => {
    await Diary.create({ user_id, tour_id, title, content });
  };

  // 여행 일지 조회
  getDiary = async (diary_id) => {
    return await Diary.findOne({ where: { id: diary_id } });
  };

  // 내 모든 여행 일지 조회
  getMyDiaries = async (user_id) => {
    return await Diary.findAll({ where: { user_id } });
  };

  // 여행 계획 여행 일지 조회
  getTourDiaries = async (tour_id) => {
    return await Diary.findAll({ where: { tour_id } });
  };

  // 모든 여행 일지 조회
  getDiaries = async () => {
    return await Diary.findAll();
  };

  // 여행 일지 수정
  putDiary = async (diary_id, title, content) => {
    await Diary.update({ title, content }, { where: { id: diary_id } });
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
