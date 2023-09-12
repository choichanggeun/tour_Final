const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const client = require('./redis');
require('dotenv').config();
const secret = process.env.COOKIE_SECRET;

module.exports = {
  sign: (user) => {
    const payload = {
      ok: true,
      id: user.id,
    };

    return jwt.sign(payload, secret, {
      algorithm: 'HS256', //
      expiresIn: '1h', //
    });
  },
  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        ok: true,
        id: decoded.id,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => {
    // refresh token 발급
    return jwt.sign({}, secret, {
      // refresh token은 payload 없이 발급
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshVerify: async (token, userId) => {
    // refresh token 검증
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(client.get).bind(client);

    try {
      const data = await getAsync(userId); // refresh token 가져오기
      if (token === data) {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
