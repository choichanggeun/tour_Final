const { User, EmailAuth } = require('../models');

const bcrypt = require('bcrypt');

class UserRepository {
  // 회원가입
  createUser = async (email, password, confirm, nickname) => {
    const encrypted = await bcrypt.hash(password, 10);
    const createUserData = await User.create({
      email,
      password: encrypted,
      confirm,
      nickname,
    });

    return createUserData;
  };
  // 로그인
  findLoginUser = async (email) => {
    const user = await User.findOne({ where: { email: email } });

    return user;
  };
  //로그아웃
  //로그 아웃은 일반적으로 클라이언트 측에서 토큰을 지우고
  //서버에서 토큰을 처리 할 필요가 없기 때문에 로그 아웃 방법을 추가 할 필요가 없습니다.

  // 사용자 정보 조회
  findUserId = async (user_id) => {
    return await User.findOne({ where: { id: user_id } });
  };
  // 사용자 정보 수정
  updateUser = async (user_id, nickname, password) => {
    await User.update({ nickname, password }, { where: { id: user_id } });
    return;
  };

  // 사용자 정보 삭제(회원탈퇴)
  deleteUser = async (user_id) => {
    const result = await User.destroy({ where: { id: user_id } });
    return result;
  };
  //이메일 인증할 때 인증메일을 보냈는지 확인
  findOneIsEmailValid = async (email) => {
    return await EmailAuth.findOne({ where: { email: email } });
  };
  // 인증 메일 보내기
  createIsEmailValid = async (email, auth_code) => {
    return await EmailAuth.create({ email, auth_code });
  };
}

module.exports = UserRepository;
