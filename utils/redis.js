const redis = require('redis');
const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

module.exports = redisCli;
