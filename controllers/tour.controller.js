const TourService = require('../services/tour.service');

class TourController {
  tourService = new TourService();

  //여행 계획 등록
  postTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      console.log(user_id);
      const { title, start_date, end_date } = req.body;
      const { code, message } = await this.tourService.createTour({
        user_id,
        title,
        start_date,
        end_date,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
  // 여행 계획 조회
  getTour = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { tours, code, message } = await this.tourService.getTour({ tour_id });
      return res.status(code).json({ message, data: tours });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };
  putTour = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { title, start_date, end_date } = req.body; //
      const { code, message } = await this.tourService.putTour({
        tour_id,
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
  deleteTour = async (req, res, next) => {
    try {
      // const {user_id} = req.locals.user; 유저 부분 작성되면 수정 할 예정
      const { tour_id } = req.params;
      const { code, message } = await this.tourService.deleteTour({
        tour_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };
}

module.exports = TourController;
