const RedisRepository = require('../repositories/redis.repository');
const ToursiteRepository = require('../repositories/tour-site.repository');
const { CustomError, ServiceReturn } = require('../customError');

class TourSiteService {
  redisRepository = new RedisRepository();
  toursiteRepository = new ToursiteRepository();

  getRedis = async (key, day) => {
    const redis = await this.redisRepository.getRedis(key, day);
    let list = [];
    if (redis) {
      for (let i = 0; i < redis.length; i++) {
        const data = await this.toursiteRepository.getTourSitebyId({ tour_site_id: redis[i] });
        list.push(data.data);
      }
    }
    return new ServiceReturn('redis 불러오기 완료', 201, list);
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
