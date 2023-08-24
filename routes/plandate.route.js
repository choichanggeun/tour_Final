const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const PlanDateController = require('../controllers/plandate.controller');
const planDateController = new PlanDateController();

// 여행일자 생성
router.post('/:tour_id/planDate/', authMiddleware, planDateController.postPlanDate);

// 여행일자 조회
router.get('/:tour_id/planDate', authMiddleware, planDateController.getPlanDate);

//여행일자 수정
router.put('/:plan_date_id/planDate', authMiddleware, planDateController.putPlanDate);

//여행일자 삭제
router.delete('/:plan_date_id/planDate', authMiddleware, planDateController.deletePlanDate);

module.exports = router;
