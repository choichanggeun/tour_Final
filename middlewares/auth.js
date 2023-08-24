const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const env = process.env;
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    // console.log(authorization);
    if (!authorization) {
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '토큰 타입이 일치하지 않습니다.' });
    }
    const decodedToken = jwt.verify(token, env.COOKIE_SECRET);
    const user_id = decodedToken.user_id;

    if (!user_id) {
      return res.status(401).json({ message: '토큰 사용자 ID가 없습니다.' });
    }
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      res.clearCookie('authorization');
      return res.status(401).json({ message: '토큰 사용자가 존재하지 않습니다.' });
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
