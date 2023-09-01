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
router.put('/users/', auth, userController.updateUser);
// 사용자 정보 삭제(회원탈퇴)
router.delete('/users/', auth, userController.deleteUser);
// 인증 메일 생성, 해당 메일에 보내기
router.post('/users/authemail', userController.isEmailValid);

// 홈페이지 홈화면에서 상단 header에 로그인이 나올 지 회원정보가 나올 지 판단 용
router.get('/users/me', auth, async (req, res) => {
  const id = res.locals.user.id;

  const user = await User.findOne({ where: { id: id } });

  return res.status(200).json({ data: user });
});

module.exports = router;
