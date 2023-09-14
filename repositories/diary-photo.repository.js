const { DiaryPhoto, Diary } = require('../models');

class DiaryPhotoRepository {
  postDiaryPhoto = async (diary_id, diary_img) => {
    await DiaryPhoto.create({ diary_id, diary_img });
  };

  getDiaryPhoto = async (diary_id) => {
    return await DiaryPhoto.findAll({ where: { diary_id } });
  };

  getAllDiaryPhotos = async () => {
    return await DiaryPhoto.findAll();
  };

  deleteDiaryPhoto = async (photo_id) => {
    await DiaryPhoto.destroy({ where: { id: photo_id } });
  };

  getPhoto = async (photo_id) => {
    return await DiaryPhoto.findOne({ where: { id: photo_id } });
  };

  getDiary = async (diary_id) => {
    return await Diary.findOne({ where: { id: diary_id } });
  };

  getDiaryByPhotoId = async (photo_id) => {
    return await DiaryPhoto.findOne({ where: { id: photo_id }, include: [{ model: Diary, attributes: ['user_id'] }] });
  };
}

module.exports = DiaryPhotoRepository;
