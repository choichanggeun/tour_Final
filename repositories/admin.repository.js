const { Admin, EmailAuth } = require('../models');
const bcrypt = require('bcrypt');

class AdminRepository {
  createAdmin = async (email, password) => {
    const encrypted = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: encrypted });
  };

  findAdminId = async (admin_id) => {
    return await Admin.findOne({ where: { id: admin_id } });
  };

  findAdminEmail = async (email) => {
    return await Admin.findOne({ where: { email: email } });
  };

  findOneIsEmailValid = async (email) => {
    return await EmailAuth.findOne({ where: { email: email } });
  };

  createIsEmailValid = async (email, auth_code) => {
    return await EmailAuth.create({ email, auth_code });
  };
}

module.exports = AdminRepository;
