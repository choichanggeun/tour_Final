const { Diary } = require('../models');

class DiaryRepository {
  postDiary = async (tour_id, title, content, diary_img) => {
    await Diary.create({ tour_id, title, content, diary_img });
  };

  getDiary = async (tour_id) => {
    return await Diary.findByPk(tour_id);
  };

  putDiary = async (tour_id, diary_id, title, content, diary_img) => {};

  deleteDiary = async (tour_id, diary_id) => {};
}

module.exports = DiaryRepository;
