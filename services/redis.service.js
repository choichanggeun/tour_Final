const RedisRepository = require('../repositories/redis.repository');
const ToursiteRepository = require('../repositories/tour-site.repository');
const { CustomError, ServiceReturn } = require('../customError');

class RedisService {
  redisRepository = new RedisRepository();
  toursiteRepository = new ToursiteRepository();

  getRedis = async (key, day) => {
    const redis = await this.redisRepository.getRedis(key, day);
    let list = [];
    if (redis) {
      for (let i = 0; i < redis.length; i++) {
        let value = JSON.parse(redis[i]);
        const findSite = await this.toursiteRepository.getTourSitebyId({ tour_site_id: value.site_id });
        const mapData = {
          id: findSite.id,
          site_name: findSite.site_name,
          site_address: findSite.site_address,
          site_img: findSite.site_img,
          mapx: findSite.mapx,
          mapy: findSite.mapy,
          start_time: value.start_time,
          end_time: value.end_time,
        };
        list.push(mapData);
        console.log(list);
      }
    }
    return new ServiceReturn('redis 불러오기 완료', 201, list);
  };

  createRedis = async (key, site_id, day, start_time, end_time) => {
    await this.redisRepository.createRedis(key, site_id, day, start_time, end_time);
    return new ServiceReturn('redis 저장완료', 201);
  };
  deleteRedis = async (key, day) => {
    await this.redisRepository.deleteRedis(key, day);
    return new ServiceReturn('redis 삭제완료', 201);
  };
}
module.exports = RedisService;
