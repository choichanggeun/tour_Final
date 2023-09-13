const redis = require('redis');
require('dotenv').config(); //환경변수를 관리하는 구성패키지
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USER } = process.env;

const redisClient = redis.createClient({
  url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

module.exports = redisCli;
