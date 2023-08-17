const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const UserController = require('../controllers/user.controller');
const userController = new UserController();

// 로그인
router.post('/login', userController.login);

module.exports = router;
