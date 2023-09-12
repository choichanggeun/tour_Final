// refresh.js
const { sign, verify, refreshVerify } = require('.././utils/jwt-util');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization) {
      return res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
    }
    let [tokenType, accessToken, refreshToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '올바른 인증 방법이 필요합니다.' });
    }

    if (accessToken && refreshToken) {
      const authResult = verify(accessToken);
      const decoded = jwt.decode(accessToken);

      if (decoded === null) {
        return res.status(401).json({ message: '로그인이 필요한 서비스입니다.' });
      }

      const refreshResult = refreshVerify(refreshToken, decoded.id);

      if (authResult.ok === false && authResult.message === 'jwt expired') {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
        if (refreshResult.ok === false) {
          return res.status(401).json({ message: '토큰이 만료되었습니다.' });
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const newAccessToken = sign(user);
          let accessToken = newAccessToken;
          res.cookie('authorization', `Bearer ${accessToken} ${refreshToken}`);
        }
      }
    } else {
      // access token 또는 refresh token이 헤더에 없는 경우
      return res.status(401).json({ message: '토큰 발급이 필요한 서비스입니다.' });
    }
  } catch (error) {
    res.clearCookie('authorization');

    return res.status(401).json({
      errorMessage: error.message,
    });
  }
};

module.exports = refresh;
