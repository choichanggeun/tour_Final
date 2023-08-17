const express = require('express');
const router = express.Router();
require('dotenv').config();
const env = process.env;

const auth = require('../middlewares/auth');

const AdminController = require('../controllers/admin.controller');
const adminController = new AdminController();

// 관리자 생성
router.post(`/${env.ADMIN_URL}`, adminController.createAdmin);

module.exports = router;
