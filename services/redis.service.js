const RedisRepository = require('../repositories/redis.repository');
const { CustomError, ServiceReturn } = require('../customError');

class TourSiteService {
  redisRepository = new RedisRepository();

  getRedis = async (key, day) => {
    const redis = await this.redisRepository.getRedis(key, day);
    return new ServiceReturn('redis 불러오기 완료', 201, redis);
  };

  createRedis = async (key, site_id, day) => {
    await this.redisRepository.createRedis(key, site_id, day);
    return new ServiceReturn('redis 저장완료', 201);
  };
  deleteRedis = async (key, day) => {
    await this.redisRepository.deleteRedis(key, day);
    return new ServiceReturn('redis 삭제완료', 201);
  };
}
module.exports = TourSiteService;
