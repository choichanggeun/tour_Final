const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const DiaryController = require('../controllers/diary.controller');
const diaryController = new DiaryController();

// 여행 일지 작성
router.post('/tours/:tour_id/diaries', auth, diaryController.postDiary);

// 여행 일지 조회
router.get('/diaries/:diary_id', diaryController.getDiary);

// 내 모든 여행 일지 조회
router.get('/my_diaries', auth, diaryController.getMyDiaries);

// 여행 계획 여행 일지 조회
router.get('/tours/:tour_id/diaries', diaryController.getTourDiaries);

// 모든 여행 일지 조회
router.get('/diaries', diaryController.getDiaries);

// 여행 일지 검색
router.get('/search_diaries', diaryController.searchDiaries);

// 여행 일지 수정
router.put('/diaries/:diary_id', auth, diaryController.putDiary);

// 여행 일지 삭제
router.delete('/diaries/:diary_id', auth, diaryController.deleteDiary);

module.exports = router;
