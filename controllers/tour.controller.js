const TourService = require('../services/diary.service');

class TourController {
  tourService = new TourService();

  postTour = async (req, res) => {
    try {
      return res.status(200).json({ message: '메세지 내용' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
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
