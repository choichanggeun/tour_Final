const express = require('express');
// const auth = require('../middlewares/auth');

const router = express.Router();

const DiaryController = require('../controllers/diary.controller');
const diaryController = new DiaryController();

// 여행 일지 작성
router.post('/tours/:tour_id/diaries', diaryController.postDiary);

// 내 여행 일지 조회
router.get('/diaries', diaryController.getDiary);

// 여행 일지 수정
router.put('/diaries/:diary_id', diaryController.putDiary);

// 여행 일지 삭제
router.delete('/diaries/:diary_id', diaryController.deleteDiary);

module.exports = router;
