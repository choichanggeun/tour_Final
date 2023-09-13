const client = require('../utils/redis');
class RedisRepository {
  getRedis = async (key, day) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    return await client.lRange(REDIS_PREFIX + key + REDIS_SUFFIX + day, 0, -1);
  };
  createRedis = async (key, site_id, day, start_time, end_time) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    const formdata = { site_id, day, start_time, end_time };
    await client.RPUSH(REDIS_PREFIX + key + REDIS_SUFFIX + day, JSON.stringify(formdata));
    await client.expire(REDIS_PREFIX + key + REDIS_SUFFIX + day, 1800);
  };
  deleteRedis = async (key, day) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    await client.rPop(REDIS_PREFIX + key + REDIS_SUFFIX + day);
  };
}

module.exports = RedisRepository;
