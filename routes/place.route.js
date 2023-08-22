const express = require('express');

const router = express.Router();

const PlaceController = require('../controllers/place.controller');
const placeController = new PlaceController();

// 여행 경유지 생성
router.post('/place/:plan_date_id/place', placeController.postPlace);

// 여행 일지 조회
router.get('/place/:plan_date_id/place/', placeController.getPlace);

// 여행 일지 수정
router.put('/place/:plan_date_id/:place_id/', placeController.putPlace);

// 여행 일지 삭제
router.delete('/place/:plan_date_id/:place_id/', placeController.deletePlace);

module.exports = router;
