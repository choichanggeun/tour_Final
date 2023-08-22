const TourRepository = require('../repositories/tour.repository');

class TourService {
  tourRepository = new TourRepository();

  // 여행 계획 작성

  createTour = async ({ title, start_date, end_date }) => {
    if (!title) throw { code: 401, message: 'title을 입력해주세요.' };

    if (!start_date) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!end_date) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createTourData = await this.tourRepository.createTour({
      title,
      start_date,
      end_date,
    });

    if (!createTourData) throw { code: 401, message: '여행계획 등록이 실패하였습니다. 않습니다.' };

    return { createTourData, code: 200, message: '여행계획 작성이 완료되었습니다.' };
  };
  //여행계획 조회
  getTour = async ({ tour_id }) => {
    // 매개변수 객체로 수정
    if (!tour_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    const findTour = await this.tourRepository.getTour(tour_id);

    return {
      findTour,
      code: 200,
      message: '여행계획 조회가 완료되었습니다.',
    };
  };
  //여행계획 수정
  putTour = async ({ tour_id, title, start_date, end_date }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const updatedTour = await this.tourRepository.updateTour({
      tour_id,
      title,
      start_date,
      end_date,
    });

    if (!updatedTour) throw { code: 400, message: '여행 계획 수정에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 수정되었습니다.' };
  };
  //여행계획 삭제
  deleteTour = async ({ tour_id }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.tourRepository.deleteTour({ tour_id });

    if (!deletedTour) throw { code: 400, message: '여행 계획 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 삭제되었습니다.' };
  };
}

module.exports = TourService;
