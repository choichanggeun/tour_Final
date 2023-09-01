const UserService = require('../services/user.service');

class UserController {
  userService = new UserService();

  // 회원가입
  createUser = async (req, res, next) => {
    try {
      const { email, password, confirm, nickname, authCode } = req.body;
      const { status, message, result } = await this.userService.createUser(email, password, confirm, nickname, authCode);
      return res.status(status).json({ message, status });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
  // 로그인
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await this.userService.loginUser(email, password);
      const cookieConfig = {
        //cookieConfig는 키, 밸류 외에 설정을 보낼 수 있다.
        maxAge: 60000 * 60,
        //밀리초 단위로 들어가는데 30000을 설정하면 30초만료 쿠키를 생성한다.
        path: '/',
        httpOnly: true,
        //통신할때만 접속할 수 있다. 기본값은 false임
      };
      res.cookie('authorization', `Bearer ${token}`, cookieConfig);
      res.status(200).json({ message: '로그인 성공.' });
    } catch (error) {
      console.error(error.stack);
      res.status(401).json({ message: error.message });
    }
  };
  // 로그아웃
  logout = (req, res) => {
    try {
      res.clearCookie('authorization');

      return res.status(200).json({ message: '로그아웃이 완료되었습니다.' });
    } catch (error) {
      res.status(500).json({ errorMessage: '로그아웃에 실패했습니다.' });
    }
  };
  // 사용자 정보 조회
  getUser = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user; //로그인된 사용자의 ID를 가져옴
      const data = await this.userService.getUser(user_id);

      if (!data) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 필요한 사용자 정보를 반환
      return res.send({ data });
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  // 사용자 정보 수정
  updateUser = async (req, res) => {
    const { nickname, password } = req.body;
    const { id: user_id } = res.locals.user;
    const { message, result } = await this.userService.updateUser(user_id, nickname, password);
    return res.status(201).json({ message, result });
  };
  // 사용자 정보 삭제(회원탈퇴)
  deleteUser = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { message, result } = await this.userService.deleteUser(user_id);
      res.status(200).json({ message, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errorMessage: '회원탈퇴에 실패하였습니다.' });
    }
  };

  // 이메일 인증
  isEmailValid = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const { status, message } = await this.userService.isEmailValid(email);
      return res.status(status).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.error(err);
      return res.status(500).json({ result: '오류가 발생하였습니다.' });
    }
  };
}
module.exports = UserController;
