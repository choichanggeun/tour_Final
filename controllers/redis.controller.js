const RedisService = require('../services/redis.service');

class RedisController {
  redisService = new RedisService();

  getRedis = async (req, res, next) => {
    try {
      const { key, day } = req.params;
      const { status, message, result } = await this.redisService.getRedis(key, day);
      return res.status(status).json({ message, result });
    } catch (error) {
      console.log(error);
    }
  };

  createRedis = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { site_id, day } = req.body;
      const { status, message, result } = await this.redisService.createRedis(key, site_id, day);
      return res.status(status).json({ message, result });
    } catch (error) {
      console.log(error);
    }
  };

  deleteRedis = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { day } = req.body;
      const { status, message, result } = await this.redisService.deleteRedis(key, day);
      return res.status(status).json({ message, result });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = RedisController;
