const AdminService = require('../services/admin.service');

class AdminController {
  adminService = new AdminService();

  // 관리자 생성
  createAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    const { status, message } = await this.adminService.createAdmin(email, password);

    res.status(status).json({ message });
  };
}
module.exports = AdminController;
