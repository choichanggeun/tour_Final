const { TourSite } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');
const redisCli = require('./../utils/redis');
const sigunguCode = [25, 10, 5, 9, 5, 16, 5, 1];
const list = [
  {
    site_name: '서울',
    site_address: '서울특별시 용산구 한강대로 405',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMThfMTEz%2FMDAxNjc2Njk4NTAxNzQx.kY1YIIwezLsSxg-OAvIJr_HnNJsMKLQY426VYYtxLoQg.1j1WgVvbijgPZDauOKVZPL3bNtgVaGQOC40MX50AWl4g.JPEG.keep_calm_peace%2FIMG_9242.jpg&type=a340',
    mapx: 127.0016985,
    mapy: 37.5642135,
  },
  {
    site_name: '인천',
    site_address: '인천광역시 중구 제물량로 269',
    site_img: 'https://image.ajunews.com/content/image/2016/12/12/20161212090053271662.jpg',
    mapx: 126.7052062,
    mapy: 37.4562557,
  },
  {
    site_name: '대전',
    site_address: '대전광역시 동구 중앙로 215',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20121031_46%2Fjbey007_1351609727819lj756_JPEG%2FJJB_3077.jpg&type=a340',
    mapx: 127.3845475,
    mapy: 36.3504119,
  },
  {
    site_name: '대구',
    site_address: '대구광역시 북구 태평로 161',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTA2MTlfMTc1%2FMDAxNTYwOTA4ODE1MjA1.56BvBkmihYGgU2RFtWyvjdb3EgzbUpw0KN_plwJtExwg.5BSObumDg2Kfn43DTBlbUpGzUXYf4r16cepEhtaQy5og.JPEG.heajinp1004%2FIMG_2616.jpg&type=a340',
    mapx: 128.601445,
    mapy: 35.8714354,
  },
  {
    site_name: '광주',
    site_address: '광주광역시 북구 무등로 235',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA5MjBfMjk4%2FMDAxNjMyMTI0MDUzNDgz.XXM5mUfUM2WQeb4JtF5Rk5_MysE8fvqnM2INYpLbEDsg.SmI2YNju6G-E0j6VI4Zstd8Khjx9A2zK3WRaK8muoJcg.JPEG.kivwk%2F20210920%25A3%25DF112342.jpg&type=a340',
    mapx: 126.8526012,
    mapy: 35.1595454,
  },
  {
    site_name: '제주',
    site_address: '제주특별자치도 제주시 공항로 2 제주국제공항',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fcafefiles.naver.net%2F20141111_276%2Fdh1600_14157114713762ISYU_JPEG%2F%25C5%25A9%25B1%25E2%25BA%25AF%25C8%25AF_8H4A4159.JPG&type=a340',
    mapx: 126.5311884,
    mapy: 33.4996213,
  },
  {
    site_name: '울산',
    site_address: '울산광역시 울주군 삼남읍 울산역로 177',
    site_img: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNzA4MjhfMjQ5%2FMDAxNTAzODk2MDYxNTEy.d-fA47Ve7SZZttQH8qHDjV4F7jRkBUQ0-hN3sA3IRhkg.0NfedPmhvcLM32smDX6zn1QeP3fRqhZXb_2f_Fo4oJYg.JPEG.potoi%2F20170827_105512_%25C0%25CF%25BB%25EA%25B5%25BF.jpg&type=a340',
    mapx: 129.3113596,
    mapy: 35.5383773,
  },
  {
    site_name: '강원',
    site_address: '강원특별자치도 강릉시 용지로 176',
    site_img: 'https://weekly.chosun.com/news/photo/202306/27370_50964_2450.gif',
    mapx: 128.8793704,
    mapy: 37.7406187,
  },
  {
    site_name: '부산',
    site_address: '부산광역시 동구 중앙대로 206',
    site_img: 'https://m.badajang.kr/file_data/jnut/gallery/2019/03/19/7a31999cd418021c17fce84f09275ecb.png',
    mapx: 129.05562775,
    mapy: 35.1379222,
  },
  {
    site_name: '경주',
    site_address: '경상북도 경주시 건천읍 경주역로 80',
    site_img: 'https://a.cdn-hotels.com/gdcs/production102/d1023/e3c18663-14e2-49e3-b9f0-bd7a029a661f.jpg',
    mapx: 129.0820477,
    mapy: 35.4754114,
  },
  {
    site_name: '전주',
    site_address: '전라북도 전주시 덕진구 동부대로 680',
    site_img: 'https://www.jeollailbo.com/news/photo/202305/691824_91398_5826.jpg',
    mapx: 127.1479532,
    mapy: 35.8242238,
  },
  {
    site_name: '춘천',
    site_address: '강원특별자치도 춘천시 공지로 591',
    site_img: 'https://www.hotelrestaurant.co.kr/data/photos/20220834/art_16613161004291_b2fc1f.jpg',
    mapx: 127.7169083,
    mapy: 37.8847972,
  },
];
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

  getTourSite = async (tour_site_id) => {
    return await TourSite.findOne({ where: { id: tour_site_id } });
  };

  getTourSitebyId = async ({ tour_site_id }) => {
    const data = await TourSite.findOne({ where: { id: tour_site_id } });
    return data;
  };
  searchSiteList = async (search_data, search_type) => {
    if (search_type === '주소') {
      return await TourSite.findAll({ where: { site_address: { [Op.like]: '%' + search_data + '%' } } });
    } else if (search_type === '제목') {
      return await TourSite.findAll({ where: { site_name: { [Op.like]: '%' + search_data + '%' } } });
    }
  };

  getFirstSite = async () => {
    let value = await redisCli.get('firstSite', 0, -1);
    if (value) {
      return JSON.parse(value);
    } else {
      let data = await TourSite.findAll({ limit: 12, order: [['id', 'ASC']] });
      await redisCli.set('firstSite', JSON.stringify(data));
      await redisCli.expire('firstSite', 360);
      return data;
    }
  };

  //이거 먼저 실행해야함
  firstTourSite = async () => {
    for (let i = 0; i < 12; i++) {
      await TourSite.create(list[i]);
    }
  };
  createTourSite = async (startNumber) => {
    var i = startNumber; // max = 8, min = 1(서울) 2(인천)
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
