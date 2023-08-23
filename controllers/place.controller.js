const PlaceService = require('../services/place.service');

class PlaceController {
  placeService = new PlaceService();

  //여행 경유지 등록
  postPlace = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { plan_date_id, tour_site_id } = req.params;
      const { code, message } = await this.placeService.createPlace({
        user_id,
        plan_date_id,
        tour_site_id,
      });
      return res.status(code).json({ message });
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

  //여행 경유지 수정
  putPlace = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { title, start_date, end_date } = req.body; //
      const { code, message } = await this.placeService.putPlace({
        title,
        start_date,
        end_date,
      });

      return res.status(code).json({ message });
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
