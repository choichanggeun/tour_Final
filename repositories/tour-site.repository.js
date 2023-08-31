const { TourSite } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');
const redis = require('redis');
//Redis 실행
const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

class ToursiteRepository {
  getTourSiteList = async () => {
    let value = await redisCli.get('toursite', 0, -1);
    if (value) {
      return JSON.parse(value);
    } else {
      let data = await TourSite.findAll();
      await redisCli.set('toursite', JSON.stringify(data));
      await redisCli.expire('toursite', 360);
    }
    return await TourSite.findAll();
  };

  getTourSite = async (tour_id) => {
    return await TourSite.findOne({ where: { id: tour_id } });
  };
  searchSiteList = async (search_data, search_type) => {
    if (search_type === '주소') {
      return await TourSite.findAll({ where: { site_address: { [Op.like]: '%' + search_data + '%' } } });
    } else if (search_type === '제목') {
      return await TourSite.findAll({ where: { site_name: { [Op.like]: '%' + search_data + '%' } } });
    }
  };

  createTourSite = async (startNumber) => {
    var i = startNumber; // max = 127503, min = 125701
    var timer = setInterval(async function () {
      if (i > 125720) {
        clearInterval(timer);
      } else {
        const result = await axios({
          url: `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=testApp&_type=json&contentId=${i}&contentTypeId=12&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=N&numOfRows=10&pageNo=1&serviceKey=hrod6tZP0dYmxXU3PQEgldYC6jxh0vc0sCpDTi5%2Fo%2FAGn86x5kYA7nzJhu0l0uUWM%2Fks%2FOozWsCz8H74FkGKEQ%3D%3D`, // 통신할 웹문서
          method: 'get', // 통신할 방식
        });
        if (result.data.response.body.items !== '') {
          const site_name = result.data.response.body.items.item[0].title;
          if (site_name) {
            if (result.data.response.body.items.item[0].firstimage === '') {
              const site_address = result.data.response.body.items.item[0].addr1;
              const site_img = '/img/Oops-error.jpg';
              const mapx = result.data.response.body.items.item[0].mapx;
              const mapy = result.data.response.body.items.item[0].mapy;
              await TourSite.create({ site_name, site_address, site_img, mapx, mapy });
            } else {
              const site_address = result.data.response.body.items.item[0].addr1;
              const site_img = result.data.response.body.items.item[0].firstimage;
              const mapx = result.data.response.body.items.item[0].mapx;
              const mapy = result.data.response.body.items.item[0].mapy;
              await TourSite.create({ site_name, site_address, site_img, mapx, mapy });
            }
          }
          i++;
        } else {
          i++;
        }
      }
    }, 1000);
  };

  initTourSite = async () => {
    await TourSite.destroy({ where: {} }, { TRUNCATE: true });
  };
}

module.exports = ToursiteRepository;
