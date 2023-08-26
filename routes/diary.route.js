const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const DiaryController = require('../controllers/diary.controller');
const diaryController = new DiaryController();

// 여행 일지 작성
router.post('/tours/:tour_id/diaries', auth, diaryController.postDiary);

// 내 모든 여행 일지 조회
router.get('/diaries', auth, diaryController.getDiary);

// 여행 일지 수정
router.put('/diaries/:diary_id', auth, diaryController.putDiary);

// 여행 일지 삭제
router.delete('/diaries/:diary_id', auth, diaryController.deleteDiary);

module.exports = router;
