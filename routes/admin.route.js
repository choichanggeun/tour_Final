const express = require('express');
const router = express.Router();
require('dotenv').config();
const env = process.env;
const { Admin } = require('../models');

const adminauth = require('../middlewares/adminauth');

const AdminController = require('../controllers/admin.controller');
const adminController = new AdminController();

// 관리자 생성
router.post('/admin', adminController.createAdmin);
// 관리자 로그인
router.post('/adminlogin', adminController.adminLogin);

// 홈페이지 홈화면에서 상단 header에 로그인이 나올 지 회원정보가 나올 지 판단 용
router.get('/admin/me', adminauth, async (req, res) => {
  const id = res.locals.admin.id;

  const admin = await Admin.findOne({ where: { id: id } });

  return res.status(200).json({ data: admin });
});

module.exports = router;
