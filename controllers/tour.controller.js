const TourService = require('../services/tour.service');

class TourController {
  tourService = new TourService();

  //여행 계획 등록
  postTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_site_id } = req.params;
      const { title, start_date, end_date } = req.body;
      const { result, code, message } = await this.tourService.createTour({
        user_id,
        title,
        start_date,
        end_date,
        tour_site_id,
      });
      return res.status(code).json({ result, message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
  // 단일 여행 계획 조회 (tour_id)
  getTourOne = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { code, message, result } = await this.tourService.getTourOne(tour_id);
      return res.status(code).json({ message, result });
    } catch (error) {
      console.log(error);
      return res.status(error.code).json({ message: error.message });
    }
  };
  // 모든 여행 계획 조회
  getTourList = async (req, res, next) => {
    try {
      const { code, message, result } = await this.tourService.getTourList();
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 좋아요 순으로 여행 계획 조회
  getLikeList = async (req, res, next) => {
    try {
      const { code, message, result } = await this.tourService.getLikeList();
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  searchTour = async (req, res, next) => {
    try {
      const { search_data, search_type } = req.params;
      const { code, message, result } = await this.tourService.searchTour(search_data, search_type);
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 로그인한 유저의 여행 계획 조회
  getTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { data, code, message } = await this.tourService.getTourData({ user_id });
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };
  // 여행 계획 수정
  putTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { title, start_date, end_date } = req.body;
      const { code, message } = await this.tourService.putTour({
        user_id,
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
  // 여행 계획 삭제
  deleteTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { code, message } = await this.tourService.deleteTour({
        user_id,
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
