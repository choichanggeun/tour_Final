const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const BannerController = require('../controllers/banner.controller');
const bannerController = new BannerController();

// 관리자 생성
router.get('/', bannerController.getBannerList);
router.post('/', bannerController.createBanner);
router.put('/', bannerController.updateBanner);
router.delete('/', bannerController.deleteBanner);

module.exports = router;
