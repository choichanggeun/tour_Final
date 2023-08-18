const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');
const upload = require('../middlewares/uploadFile.js');

const BannerController = require('../controllers/banner.controller');
// const bannerController = new BannerController();

//배너 리스트
router.get('/banner', bannerController.getBannerList);
//배너 생성
router.post('/banner', adminAuth, upload, bannerController.createBanner);
//배너 수정
router.put('/banner/:banner_id', adminAuth, upload, bannerController.updateBanner);
//배너 삭제
router.delete('/banner/:banner_id', adminAuth, bannerController.deleteBanner);

module.exports = router;
