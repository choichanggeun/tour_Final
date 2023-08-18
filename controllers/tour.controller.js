const TourService = require('../services/diary.service');

class TourController {
  tourService = new TourService();
  //여행 계획 등록
  postTour = async (req, res, next) => {
    try {
      const { user_id, nickname } = req.locals.user;
      const { title, start_date, end_date } = req.body;
      const { code, message } = await this.tourService.postTour({
        user_id,
        nickname,
        title,
        content,
        start_date,
        end_date,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status.send({ message: err.message });
    }
  };
  getTour = async (req, res) => {
    try {
      return res.status(200).json({ message: '메세지 내용' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
  putTour = async (req, res) => {
    try {
      return res.status(200).json({ message: '메세지 내용' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
  deleteTour = async (req, res) => {
    try {
      return res.status(200).json({ message: '메세지 내용' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
}

module.exports = TourController;
