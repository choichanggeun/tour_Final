const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminauth');
const upload = require('../middlewares/uploadFile.js');

const BannerController = require('../controllers/banner.controller');
// const bannerController = new BannerController();

<<<<<<< HEAD
// 관리자 생성
// router.get('/', bannerController.getBannerList);
// router.post('/', bannerController.createBanner);
// router.put('/', bannerController.updateBanner);
// router.delete('/', bannerController.deleteBanner);
=======
//배너 리스트
router.get('/banner', bannerController.getBannerList);
//배너 생성
router.post('/banner', adminAuth, upload, bannerController.createBanner);
//배너 수정
router.put('/banner/:banner_id', adminAuth, upload, bannerController.updateBanner);
//배너 삭제
router.delete('/banner/:banner_id', adminAuth, bannerController.deleteBanner);
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8

module.exports = router;
