const PlaceService = require('../services/place.service');

class PlaceController {
  placeService = new PlaceService();

  //여행 경유지 등록
  postPlace = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { plan_date_id, tour_site_id, start_time, end_time } = req.params;
      const { code, message } = await this.placeService.createPlace({
        user_id,
        plan_date_id,
        tour_site_id,
        start_time,
        end_time,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
  //여행 경유지 등록 tour_id, day, tour_site_id
  createPlace = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { days, tour_site_id, start_time, end_time } = req.body;
      const { code, message } = await this.placeService.createPlaceBytourId(user_id, tour_id, days, tour_site_id, start_time, end_time);
      console.log(code, message);
      return res.status(code).json({ code, message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
  // 여행 경유지 조회
  getPlace = async (req, res, next) => {
    try {
      const { plan_date_id, tour_site_id } = req.params;
      const { data, code, message } = await this.placeService.getPlace({ plan_date_id, tour_site_id });
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };
  // tour_id와 날짜로 경유지 조회
  getPlaceList = async (req, res, next) => {
    try {
      const { tour_id, days } = req.params;
      const { data, code, message } = await this.placeService.getPlaceList(tour_id, days);
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };

  //여행 경유지 수정
  putPlace = async (req, res, next) => {
    try {
      const { place_id } = req.params;
      const { plan_date_id, tour_site_id, start_time, end_time } = req.body; //
      const { code, message } = await this.placeService.putPlace({
        plan_date_id,
        tour_site_id,
        user_id,
        place_id,
        start_time,
        end_time,
      });

      return res.status(code).json({ message, code });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };

  //여행 경유지 삭제
  deletePlace = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { place_id } = req.params;
      const { code, message } = await this.placeService.deletePlace({
        user_id,
        place_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };
}

module.exports = PlaceController;
