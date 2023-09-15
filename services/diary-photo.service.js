const DiaryPhotoRepository = require('../repositories/diary-photo.repository');
const { CustomError } = require('../customError.js');
// const fs = require('fs');

const S3Image = require('../middlewares/s3Image');
const s3Image = new S3Image();

class DiaryPhotoService {
  diaryPhotoRepository = new DiaryPhotoRepository();

  postDiaryPhoto = async (user_id, diary_id, images) => {
    const diary = await this.diaryPhotoRepository.getDiary(diary_id);
    if (diary.user_id !== user_id) throw new CustomError('사진을 생성할 수 있는 권한이 없습니다.', 403);
    // 이미지 갯수만큼 반복문으로 데이터 베이스 접근하기
    for (let image of images) {
      let diary_img = image.key;
      await this.diaryPhotoRepository.postDiaryPhoto(diary_id, diary_img);
    }
  };

  getDiaryPhoto = async (diary_id) => {
    return await this.diaryPhotoRepository.getDiaryPhoto(diary_id);
  };

  getAllDiaryPhotos = async () => {
    return await this.diaryPhotoRepository.getAllDiaryPhotos();
  };

  deleteDiaryPhoto = async (user_id, photo_id) => {
    const diary = await this.diaryPhotoRepository.getDiaryByPhotoId(photo_id);
    if (diary.Diary.user_id !== user_id) throw new CustomError('사진을 삭제할 수 있는 권한이 없습니다.', 403);

    const { diary_img } = await this.diaryPhotoRepository.getPhoto(photo_id);
    const fileName = `diary-img/${diary_img}`;

    // s3 이미지 삭제
    s3Image.deleteImage(fileName);

    // multer 이미지 삭제
    // fs.unlink('public/img-server/' + image.diary_img);

    await this.diaryPhotoRepository.deleteDiaryPhoto(photo_id);
  };
}

module.exports = DiaryPhotoService;
