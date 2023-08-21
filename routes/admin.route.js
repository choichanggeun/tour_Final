const express = require('express');
const router = express.Router();
require('dotenv').config();
const env = process.env;

const auth = require('../middlewares/auth');

const AdminController = require('../controllers/admin.controller');
const adminController = new AdminController();

// 관리자 생성
router.post('/admin', adminController.createAdmin);
// 관리자 로그인
router.post('/adminlogin', adminController.adminLogin);
// 인증 메일 생성, 해당 메일에 보내기
router.post('/admin/authemail', adminController.isEmailValid);

module.exports = router;
