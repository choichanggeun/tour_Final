const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const TourController = require('../controllers/tour.controller');
const tourController = new TourController();

// 여행계획 생성
router.post('/:tour_site_id/tours/', authMiddleware, tourController.postTour);
// 좋아요 많은 순으로 모든 여행계획 조회
router.get('/like_tours', tourController.getLikeList);

// 모든 여행계획 조회
router.get('/tours', tourController.getTourList);
// 여행계획 조회
router.get('/tours/:tour_id', tourController.getTourOne);

// 여행 계획 검색
router.get('/search_tour/:search_data/:search_type', tourController.searchTour);
// 로그인한 유저의 여행 계획 조회
router.get('/mytours', authMiddleware, tourController.getTour);
// 여행 일지 수정
router.put('/tours/:tour_id/', authMiddleware, tourController.putTour);
// 여행 일지 삭제
router.delete('/tours/:tour_id/', authMiddleware, tourController.deleteTour);
// 여행 계획 status 0 -> 1 변경 api
router.put('/tours/status/:tour_id', authMiddleware, tourController.updateStatus);
// 로그인한 유저의 여행 계획인지 확인
router.get('/verify_tours/:tour_id', authMiddleware, tourController.getVerifyTour);

module.exports = router;
