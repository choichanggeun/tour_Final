const AdminRepository = require('../repositories/admin.repository');
const { CustomError, ServiceReturn } = require('../customError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const env = process.env;

class AdminService {
  adminRepository = new AdminRepository();

  createAdmin = async (email, password) => {
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
}
module.exports = AdminService;
