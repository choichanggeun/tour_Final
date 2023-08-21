const AdminRepository = require('../repositories/admin.repository');
const { CustomError, ServiceReturn } = require('../customError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
require('dotenv').config();
const env = process.env;
const sendMail = require('../emailauth');

class AdminService {
  adminRepository = new AdminRepository();

  createAdmin = async (email, password, authCode) => {
    console.log(email);
    const admin = await this.adminRepository.findAdminEmail(email);
    if (admin) throw new CustomError('이메일을 확인해주세요.', 403);

    const isEmailValemail = await this.adminRepository.findOneIsEmailValid(email);
    if (!isEmailValemail) throw new CustomError('이메일을 인증해 주세요.', 402);

    const isEmailValidauthCode = isEmailValemail?.auth_code == authCode;
    if (!isEmailValidauthCode) throw new CustomError('인증번호가 일치하지 않습니다.', 401);

    const isEmailValidOverTime = dayjs().diff(new Date(isEmailValemail.created_at), 'm') >= 30;
    if (isEmailValidOverTime) throw new CustomError('이메일 인증 시간이 초과되었습니다.\n이메일 인증을 재시도 해주세요.', 408);

    await this.adminRepository.createAdmin(email, password);
    return new ServiceReturn('관리자 생성 성공.', 201);
  };

  adminLogin = async (email, password) => {
    const admin = await this.adminRepository.findAdminEmail(email);
    if (!admin) throw new CustomError('이메일을 확인해주세요.', 403);

    if (admin) {
      const pwConfirm = await bcrypt.compare(password, admin.password);
      if (!pwConfirm) throw new CustomError('비밀번호를 확인해 주세요.', 403);
    }

    const token = jwt.sign({ id: admin.id }, env.COOKIE_SECRET);

    return token;
  };

  isEmailValid = async (email) => {
    const admin = await this.adminRepository.findAdminEmail(email);
    if (admin) throw new CustomError('이메일을 확인해주세요.', 403);

    const auth_code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    await this.adminRepository.createIsEmailValid(email, auth_code);

    try {
      await sendMail({
        email,
        title: '[Tour Project] 가입 인증번호 입니다.',
        body: `사용자의 가입 인증번호는 <b>'${auth_code}'</b> 입니다.`,
      });
    } catch (err) {
      console.error('[이메일 발송 실패]', err);
    }

    return new ServiceReturn('인증번호가 발송되었습니다.\n이메일을 확인해 주세요.', 200);
  };
}
module.exports = AdminService;
