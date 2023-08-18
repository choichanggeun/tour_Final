const { Admin } = require('../models');
const bcrypt = require('bcrypt');

class AdminRepository {
  createAdmin = async (email, password) => {
    const encrypted = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: encrypted });
  };

  findAdminId = async (admin_id) => {
    return await Admin.findOne({ where: { admin_id: admin_id } });
  };

  findAdminEmail = async (email) => {
    return await Admin.findOne({ where: { email: email } });
  };
}

module.exports = AdminRepository;
