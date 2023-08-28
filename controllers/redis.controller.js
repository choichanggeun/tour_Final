const RedisService = require('../services/redis.service');

class RedisController {
  redisService = new RedisService();

  createRedis = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { data } = req.body;
      console.log(key);
      const { status, message, result } = await this.redisService.createRedis(key, data);
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = RedisController;
