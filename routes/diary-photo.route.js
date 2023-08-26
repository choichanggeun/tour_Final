const express = require('express');
const auth = require('../middlewares/auth');
const uploadFile = require('../middlewares/uploadFile');

const router = express.Router();

const DiaryPhotoController = require('../controllers/diary-photo.controller');
const diaryPhotoController = new DiaryPhotoController();

// 여행일지 사진 생성
router.post('/diaries/:diary_id/photos', auth, uploadFile, diaryPhotoController.postDiaryPhoto);

// 여행일지 사진 조회
router.get('/diaries/:diary_id/photos', diaryPhotoController.getDiaryPhoto);

// 여행일지 사진 삭제
router.delete('/photos/:photo_id', auth, diaryPhotoController.deleteDiaryPhoto);

module.exports = router;
