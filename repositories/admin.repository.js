const { Admin } = require('../models');

class AdminRepository {
  createAdmin = async (email, password) => {
    await Admin.create({ email, password });
  };
}

module.exports = AdminRepository;
