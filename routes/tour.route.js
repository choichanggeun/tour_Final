const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const TourController = require('../controllers/tour.controller');
const tourController = new TourController();

// 여행계획 생성
router.post('/:tour_site_id/tours/', authMiddleware, tourController.postTour);
// 모든 여행계획 조회
router.get('/tours', tourController.getTourList);
// 여행계획 조회
router.get('/tours/:tour_id', tourController.getTourOne);

// 여행 일지 조회
router.get('/:tour_site_id/:tour_id/tours', authMiddleware, tourController.getTour);

// 여행 일지 수정
router.put('/tours/:tour_id/', authMiddleware, tourController.putTour);

// 여행 일지 삭제
router.delete('/tours/:tour_id/', authMiddleware, tourController.deleteTour);

module.exports = router;
