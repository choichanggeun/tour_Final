const TourRepository = require('../repositories/tour.repository');

class TourService {
  tourRepository = new TourRepository();

  postTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };

  getTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };

  putTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };

  deleteTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };
}

module.exports = DiaryService;
