const DiaryPhotoRepository = require('../repositories/diary-photo.repository');
const fs = require('fs');

class DiaryPhotoService {
  diaryPhotoRepository = new DiaryPhotoRepository();

  postDiaryPhoto = async (diary_id, images) => {
    // 이미지 갯수만큼 반복문으로 데이터 베이스 접근하기
    for (let image of images) {
      let diary_img = image.filename;
      await this.diaryPhotoRepository.postDiaryPhoto(diary_id, diary_img);
    }
  };

  getDiaryPhoto = async (diary_id) => {
    return await this.diaryPhotoRepository.getDiaryPhoto(diary_id);
  };

  deleteDiaryPhoto = async (photo_id) => {
    const image = await this.diaryPhotoRepository.getPhoto(photo_id);

    // 사진 파일 삭제
    fs.unlink('public/img-server/' + image.diary_img);

    await this.diaryPhotoRepository.deleteDiaryPhoto(photo_id);
  };
}

module.exports = DiaryPhotoService;
