const AdminService = require('../services/admin.service');

class AdminController {
  adminService = new AdminService();

  // 관리자 생성
  createAdmin = async (req, res, next) => {
    try {
      const { email, password, authCode } = req.body;
      const { status, message } = await this.adminService.createAdmin(email, password, authCode);
      res.status(status).json({ message });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
  //로그인
  adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const token = await this.adminService.adminLogin(email, password);
      res.cookie('authorization', `Bearer ${token}`);
      res.status(200).json({ message: '로그인 성공.' });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.error(error);
      res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
  // 이메일 인증
  isEmailValid = async (req, res) => {
    try {
      const { email } = req.body;
      const { status, message } = await this.adminService.isEmailValid(email);
      return res.status(status).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.error(err);
      return res.status(500).json({ result: '오류가 발생하였습니다.' });
    }
  };
}
module.exports = AdminController;
