const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');

const ToursiteController = require('../controllers/tour-site.controller');
const toursiteController = new ToursiteController();

//여행지 조회
router.get('/toursite', toursiteController.getTourSiteList);
//특정 여행지 조회
router.get('/toursite/:tour_id', toursiteController.getTourSite);
//검색용 여행지 조회, 주소를 토대로 검색함
router.get('/searchtour/:search_data/:search_type', toursiteController.searchTourSite);
//여행지 생성
router.post('/toursite', adminAuth, toursiteController.createTourSite);
//여행지 삭제
router.delete('/toursite', adminAuth, toursiteController.initTourSite);

module.exports = router;
