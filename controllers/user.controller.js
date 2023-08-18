const UserService = require('../services/user.service');

class UserController {
  userService = new UserService();

  // 로그인
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const token = await this.userService.loginUser(email, password);

      res.cookie('authorization', `Bearer ${token}`);

      res.status(200).json({ message: '로그인 성공.' });
    } catch (error) {
      console.error(error.stack);
      res.status(401).json({ message: error.message });
    }
  };
}

module.exports = UserController;
