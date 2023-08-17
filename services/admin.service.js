const AdminRepository = require('../repositories/admin.repository');
const { CustomError, ServiceReturn } = require('../customError');

class AdminService {
  adminRepository = new AdminRepository();

  createAdmin = async (email, password) => {
    await this.adminRepository.createAdmin(email, password);

    return new ServiceReturn('관리자 생성 성공.', 201);
  };
}
module.exports = AdminService;
