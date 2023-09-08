const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const env = process.env;
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization) {
      return res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '올바른 인증 방법이 필요합니다.' });
    }
    const decodedToken = jwt.verify(token, env.COOKIE_SECRET);
    const user_id = decodedToken.user_id;

    if (!user_id) {
      return res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
    }
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      res.clearCookie('authorization');
      return res.status(401).json({ message: '로그인 정보가 유효하지 않습니다.' });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie('authorization');

    return res.status(401).json({
      errorMessage: error.message,
    });
  }
};
