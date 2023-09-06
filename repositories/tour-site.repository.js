const { TourSite } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');
const redis = require('redis');
//Redis 실행
const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4;

const sigunguCode = [25, 10, 5, 9, 5, 16, 5, 1];
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
    var i = startNumber; // max = 7, min = 1
    let Code = sigunguCode[i - 1];
    let h = 0;
    const interval = setInterval(async function () {
      h++;
      console.log(h);
      if (h > Code - 1) {
        clearInterval(interval);
      }
      const result = await axios({
        url: `https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1?serviceKey=hrod6tZP0dYmxXU3PQEgldYC6jxh0vc0sCpDTi5/o/AGn86x5kYA7nzJhu0l0uUWM/ks/OozWsCz8H74FkGKEQ==&numOfRows=200&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&showflag=1&listYN=Y&arrange=A&contentTypeId=12&areaCode=${i}&sigunguCode=${h}`,
        method: 'get', // 통신할 방식
      });
      const list = result.data.response.body.items.item;
      if (list !== undefined) {
        console.log(list.length);
        for (let j = 0; j < list.length; j++) {
          if (list[j].firstimage !== '') {
            const site_name = list[j].title;
            const site_address = list[j].addr1;
            const site_img = list[j].firstimage;
            const mapx = list[j].mapx;
            const mapy = list[j].mapy;
            await TourSite.create({ site_name, site_address, site_img, mapx, mapy });
          }
        }
      }
    }, 5000);
  };

  initTourSite = async () => {
    await TourSite.destroy({ where: {} }, { TRUNCATE: true });
  };
}

module.exports = ToursiteRepository;
