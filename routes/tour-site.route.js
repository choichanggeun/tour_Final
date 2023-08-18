const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');

const ToursiteController = require('../controllers/tour-site.controller');
const toursiteController = new ToursiteController();

//여행지 조회
router.get('/toursite', toursiteController.getTourSiteList);
//여행지 생성
router.post('/toursite', adminAuth, toursiteController.createTourSite);
//여행지 삭제
router.delete('/toursite', adminAuth, toursiteController.initTourSite);

module.exports = router;
