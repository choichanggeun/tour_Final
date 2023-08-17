const express = require('express');

const router = express.Router();

const TourController = require('../controllers/tour.controller');
const tourController = new TourController();

// 여행계획 생성
router.post('/tours/', middleware, tourController.postTour);

// 여행 일지 조회
router.get('/tours/tour_id/', middleware, tourController.getTour);

// 여행 일지 수정
router.put('/tours/tour_id/', middleware, tourController.putTour);

// 여행 일지 삭제
router.delete('/tours/tour_id/', middleware, tourController.deleteTour);

module.exports = router;
