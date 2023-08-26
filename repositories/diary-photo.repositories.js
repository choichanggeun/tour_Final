const { DiaryPhoto } = require('../models');

class DiaryPhotoRepository {
  postDiaryPhoto = async (diary_id, diary_img) => {
    await DiaryPhoto.create({ diary_id, diary_img });
  };

  getDiaryPhoto = async (diary_id) => {
    return await DiaryPhoto.findAll({ where: { diary_id } });
  };

  deleteDiaryPhoto = async (photo_id) => {
    await DiaryPhoto.destroy({ where: { id: photo_id } });
  };

  getPhoto = async (photo_id) => {
    return await DiaryPhoto.findOne({ where: { id: photo_id } });
  };
}

module.exports = DiaryPhotoRepository;
