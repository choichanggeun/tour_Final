const { TourSite } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');
class ToursiteRepository {
  getTourSiteList = async () => {
    return await TourSite.findAll();
  };

  getTourSite = async (tour_id) => {
    return await TourSite.findOne({ where: { id: tour_id } });
  };
  searchSiteList = async (search_site) => {
    return await TourSite.findAll({ where: { site_address: { [Op.like]: '%' + search_site + '%' } } });
  };

  createTourSite = async () => {
    var i = 125714; // max = 127503, min = 125701
    var timer = setInterval(async function () {
      if (i > 125720) {
        clearInterval(timer);
      } else {
        const result = await axios({
          url: `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=testApp&_type=json&contentId=${i}&contentTypeId=12&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=N&numOfRows=10&pageNo=1&serviceKey=hrod6tZP0dYmxXU3PQEgldYC6jxh0vc0sCpDTi5%2Fo%2FAGn86x5kYA7nzJhu0l0uUWM%2Fks%2FOozWsCz8H74FkGKEQ%3D%3D`, // 통신할 웹문서
          method: 'get', // 통신할 방식
        });
        const site_name = result.data.response.body.items.item[0].title;
        if (site_name) {
          const site_address = result.data.response.body.items.item[0].addr1;
          const site_img = result.data.response.body.items.item[0].firstimage;
          const mapx = result.data.response.body.items.item[0].mapx;
          const mapy = result.data.response.body.items.item[0].mapy;
          await TourSite.create({ site_name, site_address, site_img, mapx, mapy });
        }
        i++;
      }
    }, 1000);
  };

  initTourSite = async () => {
    await TourSite.destroy({ where: {} }, { TRUNCATE: true });
  };
}

module.exports = ToursiteRepository;
