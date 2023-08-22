const express = require('express');

const router = express.Router();

const PlanDateController = require('../controllers/plandate.controller');
const planDateController = new PlanDateController();

// 여행일자 생성
router.post('planDate/:tour_id/planDate', planDateController.createPlanDate);

// 여행일자 조회
router.get('planDate/:tour_id/planDate/', planDateController.getPlanDate);

//여행일자 수정
router.put('planDate/:tour_id/:plan_date_id/', planDateController.putPlanDate);

//여행일자 삭제
router.delete('planDate/:tour_id/:plan_date_id/', planDateController.deletePlanDate);

module.exports = router;
