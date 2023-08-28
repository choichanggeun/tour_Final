const express = require('express');
const auth = require('../middlewares/auth');
// const uploadFile = require('../middlewares/uploadFile');

const router = express.Router();

const DiaryPhotoController = require('../controllers/diary-photo.controller');
const diaryPhotoController = new DiaryPhotoController();

const S3Image = require('../middlewares/s3Image');
const s3Image = new S3Image();

// 여행일지 사진 생성
router.post('/diaries/:diary_id/photos', auth, s3Image.uploadImages, diaryPhotoController.postDiaryPhoto);

// 여행일지 사진 조회
router.get('/diaries/:diary_id/photos', diaryPhotoController.getDiaryPhoto);

// 여행일지 사진 삭제
router.delete('/photos/:photo_id', auth, diaryPhotoController.deleteDiaryPhoto);

// 버켓 객체 리스트 출력 (폴더, 파일)
router.get('/photos', s3Image.getBucketLists);

module.exports = router;
