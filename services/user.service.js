const UserRepository = require('../repositories/user.repository');
const { CustomError, ServiceReturn } = require('../customError'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); //환경변수를 관리하는 구성패키지
const env = process.env; 
const dayjs = require('dayjs');

const sendMail = require('../emailauth');

class UserService {
  userRepository = new UserRepository();
  // 회원가입
  createUser = async (email, password, confirm, nickname, authCode) => {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //
    if (!emailRegex.test(email)) {
      throw new CustomError('올바른 이메일 형식이 아닙니다.', 400);
    }

    // 패스워드 형식 검사: 최소 4자 이상, 문자와 숫자 포함
    const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
    if (!passwordRegex.test(password)) {
      throw new CustomError('패스워드의 형식이 일치하지 않습니다.', 400);
    }
    // 패스워드 일치 검사
    if (password !== confirm) {
      throw new CustomError('패스워드가 일치하지 않습니다.', 400);
    }

    // 닉네임 형식 검사: 최소 3자 이상, 문자 및 숫자만 가능
    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegex.test(nickname)) {
      throw new CustomError('닉네임의 형식이 일치하지 않습니다.', 400);
    }

    const User = await this.userRepository.findLoginUser(email);
    if (User) {
      throw new CustomError('중복된 이메일입니다.', 403);
    }
    const isEmailValemail = await this.userRepository.findOneIsEmailValid(email);
    if (!isEmailValemail) {
      throw new CustomError('이메일을 인증을 먼저 해주세요.', 402);
    }
    const isEmailValidauthCode = isEmailValemail?.auth_code == authCode;
    if (!isEmailValidauthCode) {
      throw new CustomError('인증번호가 일치하지 않습니다.', 401);
    }
    const isEmailValidOverTime = dayjs().diff(new Date(isEmailValemail.created_at), 'm') >= 30;
    if (isEmailValidOverTime) {
      throw new CustomError('이메일 인증 시간이 초과되었습니다.\n이메일 인증을 재시도 해주세요.', 408);
    }
    // 패스워드 해싱 및 회원가입 진행
    const encryptedPassword = await bcrypt.hash(password, 10);
    const createUserData = await this.userRepository.createUser(email, encryptedPassword, confirm, nickname);
    
    return createUserData;
  };
  // 로그인
  loginUser = async (email, password) => {
    const user = await this.userRepository.findLoginUser(email);
    if (!user) {
      throw new Error('닉네임을 확인해주세요.');
    }
    // if (user) {
    const pwConfirm = await bcrypt.compare(password, user.password);
    if (!pwConfirm) {
      throw new Error('비밀번호를 확인해 주세요.');
    }

    const token = jwt.sign({ user_id: user.id }, env.COOKIE_SECRET);

    return token;
  };

  // 사용자 정보 조회
  getUser = async (user_id) => {
    try {
      return await this.userRepository.findUserId(user_id);
    } catch (error) {
      throw error;
    }
  };
  // 사용자 정보 수정
  updateUser = async (user_id, nickname, password) => {
    const user = await this.userRepository.updateUser(user_id);
    if (!nickname) {
      nickname = user.nickname;
    }
    if (!password) {
      password = user.password;
    } else {
      password = await bcrypt.hash(password, 10);
    }
    const result = await this.userRepository.updateUser(user_id, nickname, password);
    return { message: '정보 수정에 성공했습니다.' };
  };
  // 사용자 정보 삭제(회원탈퇴)
  deleteUser = async (user_id) => {
    const user = await this.userRepository.deleteUser(user_id);
    if (!user) return { message: '존재하지 않는 회원입니다.' };
    const result = await this.userRepository.deleteUser(user_id);
    return { message: '회원 탈퇴에 성공했습니다', result };
  };

  // 이메일 인증키 전송
  isEmailValid = async (email) => {
    const IsValidUser = await this.userRepository.findLoginUser(email);
    if (IsValidUser) throw new CustomError('이메일을 확인해주세요.', 403);

    const auth_code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    try {
      await sendMail({
        email,
        title: '[Tour Project] 가입 인증번호 입니다.',
        body: `사용자의 가입 인증번호는 <b>'${auth_code}'</b> 입니다.`,
      });
      await this.userRepository.createIsEmailValid(email, auth_code);
    } catch (err) {
      console.error('[이메일 발송 실패]', err);
    }

    return new ServiceReturn('인증번호가 발송되었습니다.\n이메일을 확인해 주세요.', 200);
  };
}

module.exports = UserService;
