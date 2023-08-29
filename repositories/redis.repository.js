const redis = require('redis');
//Redis 실행
const client = redis.createClient();
(async () => {
  await client.connect();
})();
client.on('error', function (err) {
  console.log('Error ' + err);
});

class RedisRepository {
  getRedis = async (key, day) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    return await client.lRange(REDIS_PREFIX + key + REDIS_SUFFIX + day, 0, -1);
  };
  createRedis = async (key, site_id, day) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    await client.RPUSH(REDIS_PREFIX + key + REDIS_SUFFIX + day, JSON.stringify(site_id));
    await client.expire(REDIS_PREFIX + key + REDIS_SUFFIX + day, 1800);
  };
  deleteRedis = async (key, day) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    await client.rPop(REDIS_PREFIX + key + REDIS_SUFFIX + day);
  };
}

module.exports = RedisRepository;
