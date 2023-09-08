const RedisService = require('../services/redis.service');

class RedisController {
  redisService = new RedisService();

  getRedis = async (req, res, next) => {
    try {
      const { key, day } = req.params;
      const { status, message, result } = await this.redisService.getRedis(key, day);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  createRedis = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { site_id, day, start_time, end_time } = req.body;
      const { status, message, result } = await this.redisService.createRedis(key, site_id, day, start_time, end_time);
      return res.status(status).json({ status, message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  deleteRedis = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { day } = req.body;
      const { status, message, result } = await this.redisService.deleteRedis(key, day);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
}

module.exports = RedisController;
