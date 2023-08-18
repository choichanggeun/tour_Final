const { Diary } = require('../models');

class DiaryRepository {
  // 여행 일지 작성
  postDiary = async (tour_id, title, content, diary_img) => {
    await Diary.create({ tour_id, title, content, diary_img });
  };

  // 여행 일지 조회
  getDiary = async (tour_id) => {
    return await Diary.findByPk(tour_id);
  };

  // 여행 일지 수정
  putDiary = async (tour_id, diary_id, title, content, diary_img) => {
    await Diary.update({ title, content, diary_img }, { where: { tour_id, diary_id } });
  };

  // 여행 일지 삭제
  deleteDiary = async (tour_id, diary_id) => {
    await Diary.destroy({ where: { tour_id, diary_id } });
  };
}

module.exports = DiaryRepository;
