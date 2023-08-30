const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const TourController = require('../controllers/tour.controller');
const tourController = new TourController();

// 여행계획 생성
router.post('/:tour_site_id/tours/', authMiddleware, tourController.postTour);

// 여행계획 상세 조회
router.get('/tours/:tour_id', tourController.getTourOne);

// 여행 계획 전체 조회
router.get('/tours', authMiddleware, tourController.getTour);

// 여행 일지 수정
router.put('/tours/:tour_id/', authMiddleware, tourController.putTour);

// 여행 일지 삭제
router.delete('/tours/:tour_id/', authMiddleware, tourController.deleteTour);

module.exports = router;
