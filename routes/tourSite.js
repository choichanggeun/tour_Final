const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');

const BannerController = require('../controllers/banner.controller');
const bannerController = new BannerController();

//배너 리스트
router.get('/banner', bannerController.getBannerList);
//배너 생성
router.post('/banner', adminAuth, bannerController.createBanner);
//배너 수정
router.put('/banner/:banner_id', adminAuth, bannerController.updateBanner);

module.exports = router;
