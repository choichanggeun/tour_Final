const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
require('dotenv').config();
const env = process.env;

module.exports = async (req, res, next) => {
  try {
    const { author } = req.cookies;
    const [tokenType, token] = author.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '토큰 타입이 일치하지 않습니다.' });
    }

    const decodedToken = jwt.verify(token, env.COOKIE_SECRET);
    const adminId = decodedToken.id;
    const admin = await Admin.findOne({ where: { id: adminId } });
    if (!admin) {
      res.clearCookie('author');
      return res.status(401).json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }
    res.locals.admin = admin;

    next();
  } catch (error) {
    res.clearCookie('author');
    return res.status(401).json({
      errorMessage: error.message,
    });
  }
};
