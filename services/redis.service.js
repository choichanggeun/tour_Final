const RedisRepository = require('../repositories/redis.repository');
const { CustomError, ServiceReturn } = require('../customError');

class TourSiteService {
  redisRepository = new RedisRepository();

  createRedis = async (key, data) => {
    await this.redisRepository.createRedis(key, data);
    return new ServiceReturn('redis 저장완료', 201);
  };
}
module.exports = TourSiteService;
