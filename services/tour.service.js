const TourRepository = require('../repositories/tour.repository');

class TourService {
  tourRepository = new TourRepository();

  // 여행 계획 작성
  createTour = async ({ user_id, title, start_date, end_date, tour_site_id }) => {
    if (!user_id) throw { code: 401, message: '유저ID가 존재하지않습니다.' };

    if (!title) throw { code: 401, message: 'title을 입력해주세요.' };

    if (!start_date) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!end_date) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createTourData = await this.tourRepository.createTour({
      user_id,
      title,
      start_date,
      end_date,
      tour_site_id,
    });

    if (!createTourData) throw { code: 401, message: '여행계획 등록이 실패하였습니다.' };

    return { createTourData, code: 200, message: '여행계획 작성이 완료되었습니다.' };
  };
  //여행계획 조회
  getTourData = async ({ tour_site_id, tour_id, user_id }) => {
    if (!tour_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    if (!tour_site_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }
    const findTour = await this.tourRepository.getUserTour(tour_site_id, tour_id, user_id);

    return {
      data: findTour,
      code: 200,
      message: '여행계획 조회가 완료되었습니다.',
    };
  };
  //여행계획 수정
  putTour = async ({ user_id, tour_id, title, start_date, end_date }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const updatedTour = await this.tourRepository.updateTour({
      user_id,
      tour_id,
      title,
      start_date,
      end_date,
    });

    if (!updatedTour) throw { code: 400, message: '여행 계획 수정에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 수정되었습니다.' };
  };
  //여행계획 삭제
  deleteTour = async ({ user_id, tour_id }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.tourRepository.deleteTour({ user_id, tour_id });

    if (!deletedTour) throw { code: 400, message: '여행 계획 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 삭제되었습니다.' };
  };
}

module.exports = TourService;
