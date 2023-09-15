const DiaryPhotoService = require('../services/diary-photo.service');

class DiaryPhotoController {
  diaryPhotoService = new DiaryPhotoService();

  postDiaryPhoto = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { diary_id } = req.params;
      const images = req.files;

      await this.diaryPhotoService.postDiaryPhoto(user_id, diary_id, images);
      return res.status(200).json({ message: '여행 일지 사진을 업로드했습니다.' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  getDiaryPhoto = async (req, res) => {
    try {
      const { diary_id } = req.params;

      const images = await this.diaryPhotoService.getDiaryPhoto(diary_id);
      return res.status(200).json({ images });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  getAllDiaryPhotos = async (req, res) => {
    try {
      const images = await this.diaryPhotoService.getAllDiaryPhotos();
      return res.status(200).json({ images });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  deleteDiaryPhoto = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { photo_id } = req.params;

      await this.diaryPhotoService.deleteDiaryPhoto(user_id, photo_id);
      return res.status(200).json({ message: '여행 일지 사진을 삭제했습니다.' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
}

module.exports = DiaryPhotoController;
