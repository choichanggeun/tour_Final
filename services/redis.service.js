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
      }
    }
    return new ServiceReturn('redis 불러오기 완료', 201, list);
  };

  createRedis = async (key, site_id, day, start_time, end_time) => {
    const redis = await this.redisRepository.getRedis(key, day);
    if (redis.length >= 1) {
      const lastNumber = redis.length - 1;
      let value = JSON.parse(redis[lastNumber]);
      if (value.end_time > start_time) throw new CustomError('이전 경유지와 시간이 겹칠 수 없습니다.', 401);
    }
    if (start_time > end_time) throw new CustomError('시작 시간은 끝나는 시간보다 이전이어야 합니다.', 401);
    await this.redisRepository.createRedis(key, site_id, day, start_time, end_time);
    return new ServiceReturn('경유지가 등록되었습니다.', 201);
  };
  deleteRedis = async (key, day) => {
    await this.redisRepository.deleteRedis(key, day);
    return new ServiceReturn('가장 마지막으로 등록된 경유지가 삭제되었습니다.', 201);
  };
}
module.exports = RedisService;
