const express = require('express');
const router = express.Router();

const { User } = require('../models'); //
const auth = require('../middlewares/auth');
const UserController = require('../controllers/user.controller');
const userController = new UserController();

// 회원가입
router.post('/signup', userController.createUser);
// 로그인
router.post('/login', userController.login);
//로그아웃
router.post('/logout', userController.logout);
// 사용자 정보 조회
router.get('/users', auth, userController.getUser);
// 사용자 정보 수정
router.put('/users/:user_id', auth, userController.updateUser);
// 사용자 정보 삭제(회원탈퇴)
router.delete('/users/:user_id', auth, userController.deleteUser);

module.exports = router;
