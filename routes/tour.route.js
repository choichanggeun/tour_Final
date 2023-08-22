const express = require('express');

const router = express.Router();

const TourController = require('../controllers/tour.controller');
const tourController = new TourController();

// 여행계획 생성
router.post('tours/', tourController.postTour);

// 여행 일지 조회
router.get('/tours/tour_id/', tourController.getTour);

// 여행 일지 수정
router.put('/tours/tour_id/', tourController.putTour);

// 여행 일지 삭제
router.delete('/tours/tour_id/', tourController.deleteTour);

module.exports = router;
