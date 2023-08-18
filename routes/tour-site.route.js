const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');

const ToursiteController = require('../controllers/tour-site.controller');
const toursiteController = new ToursiteController();

//배너 리스트
router.get('/toursite', toursiteController.getTourSiteList);
//배너 생성
router.post('/toursite', adminAuth, toursiteController.createTourSite);
//배너 수정
router.delete('/toursite', adminAuth, toursiteController.initTourSite);

module.exports = router;
