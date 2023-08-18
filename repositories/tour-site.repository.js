const { TourSite } = require('../models');
const axios = require('axios');

class ToursiteRepository {
  getTourSiteList = async () => {
    return await TourSite.findAll();
  };

  createTourSite = async () => {
    var i = 125701; // max = 127503, min = 125701
    var timer = setInterval(async function () {
      if (i > 125702) {
        clearInterval(timer);
      } else {
        const result = await axios({
          url: `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=testApp&_type=json&contentId=${i}&contentTypeId=12&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=N&numOfRows=10&pageNo=1&serviceKey=hrod6tZP0dYmxXU3PQEgldYC6jxh0vc0sCpDTi5%2Fo%2FAGn86x5kYA7nzJhu0l0uUWM%2Fks%2FOozWsCz8H74FkGKEQ%3D%3D`, // 통신할 웹문서
          method: 'get', // 통신할 방식
        });
        const site_name = result.data.response.body.items.item[0].title;
        const site_address = result.data.response.body.items.item[0].addr1;
        const site_img = result.data.response.body.items.item[0].firstimage;
        await TourSite.create({ site_name, site_address, site_img });
        i++;
      }
    }, 1000);
  };

  initTourSite = async () => {
    await TourSite.destroy({ where: {} }, { TRUNCATE: true });
  };
}

module.exports = ToursiteRepository;
