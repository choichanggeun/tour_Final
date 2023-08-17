const UserRepository = require('../repositories/user.repository');
const { CustomError, ServiceReturn } = require('../customError');

class UserService {
  userRepository = new UserRepository();

  loginUser = async (email, password) => {
    const user = await this.userRepository.findLoginUser(email);
    if (!user) throw new Error('닉네임을 확인해주세요.');
    if (user) {
      const pwConfirm = await bcrypt.compare(password, user.password);
      if (!pwConfirm) throw new Error('비밀번호를 확인해 주세요.');
    }

    const token = jwt.sign({ user_id: user.user_id }, env.COOKIE_SECRET);

    return token;
  };
}

module.exports = UserService;
