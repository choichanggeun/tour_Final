const { Banner } = require('../models');
const redis = require('redis');
//Redis 실행
const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.on('connect', () => {
  console.info('Redis connected!');
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

class BannerRepository {
  findBannerId = async (banner_id) => {
    return await Banner.findOne({ where: { id: banner_id } });
  };

  getBannerList = async () => {
    // let value = await redisCli.get('banner', 0, -1);
    // if (value) {
    //   return JSON.parse(value);
    // } else {
    let data = await Banner.findAll();
    // await redisCli.set('banner', JSON.stringify(data));
    // await redisCli.expire('banner', 360);
    return data;
    // }
  };

  createBanner = async (admin_id, img) => {
    await redisCli.del('banner');
    await Banner.create({ admin_id, img });
  };

  updateBanner = async (banner_id, img) => {
    await Banner.update({ img }, { where: { id: banner_id } });
  };

  deleteBanner = async (banner_id) => {
    return await Banner.destroy({ where: { id: banner_id } });
  };
}

module.exports = BannerRepository;
