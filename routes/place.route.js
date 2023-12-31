const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const PlaceController = require('../controllers/place.controller');
const placeController = new PlaceController();

// 여행 경유지 생성
router.post('/:plan_date_id/:tour_site_id/place/', authMiddleware, placeController.postPlace);
// 여행 경유지 생성 (tour_id와 days, tour_site_id)
router.post('/place/:tour_id', authMiddleware, placeController.createPlace);
// 여행 일지 조회
router.get('/:plan_date_id/:tour_site_id/place/', authMiddleware, placeController.getPlace);
// 날짜에 따른 경유지 조회
router.get('/place/:tour_id/:days', placeController.getPlaceList);
// 여행 일지 수정
router.put('/:place_id/place/', authMiddleware, placeController.putPlace);
// 여행 일지 삭제
router.delete('/:place_id/place/', authMiddleware, placeController.deletePlace);

module.exports = router;
