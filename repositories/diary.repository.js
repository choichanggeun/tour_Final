const { Diary } = require('../models');

class DiaryRepository {
  // 여행 일지 작성
  postDiary = async (user_id, tour_id, title, content, diary_img) => {
    await Diary.create({ user_id, tour_id, title, content, diary_img });
  };

  // 내 여행 일지 조회
  getDiary = async (user_id) => {
    return await Diary.findAll({ where: { user_id } });
  };

  // 여행 일지 수정
  putDiary = async (diary_id, title, content, diary_img) => {
    return await Diary.update({ title, content, diary_img }, { where: { id: diary_id } });
  };

  // 여행 일지 삭제
  deleteDiary = async (diary_id) => {
    await Diary.destroy({ where: { id: diary_id } });
  };
}

module.exports = DiaryRepository;
