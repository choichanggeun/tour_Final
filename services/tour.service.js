const TourRepository = require('../repositories/tour.repository');

class TourService {
  tourRepository = new TourRepository();

  // 여행 계획 작성

  createTour = async ({ user_id, title, start_date, end_date, tour_site_id }) => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    if (!title) throw { code: 401, message: 'title을 입력해주세요.' };
    if (!start_date) throw { code: 401, message: 'start_date 입력해주세요.' };
    if (!end_date) throw { code: 401, message: 'end_date 입력해주세요.' };
    if (new Date(start_date) > new Date(end_date)) throw { code: 401, message: '시작 날짜는 마지막 날짜보다 이전이어야 합니다.' };
    if (new Date(start_date).getFullYear() <= year && new Date(start_date).getMonth() + 1 <= month && new Date(start_date).getDate() < date) throw { code: 401, message: '과거의 날짜는 선택할 수 없습니다.' };

    const createTourData = await this.tourRepository.createTour({
      user_id,
      title,
      start_date,
      end_date,
      tour_site_id,
    });

    if (!createTourData) throw { code: 401, message: '여행계획 등록이 실패하였습니다.' };

    return { result: createTourData, code: 200, message: '여행계획 작성이 완료되었습니다.' };
  };

  getTourOne = async (tour_id) => {
    const findTour = await this.tourRepository.getTourOne(tour_id);
    return { code: 200, message: '여행계획 조회 성공', result: findTour };
  };

  getTourList = async () => {
    const findTour = await this.tourRepository.getTourList();
    const findTourList = findTour.map((tour) => {
      return {
        title: tour.title,
        nickname: tour.User.nickname,
        site_name: tour.TourSite.site_name,
        site_img: tour.TourSite.site_img,
      };
    });
    return { code: 200, message: '여행계획 조회 성공', result: findTourList };
  };

  searchTour = async (search_data, search_type) => {
    const findTour = await this.tourRepository.searchTour(search_data, search_type);
    return { code: 200, message: '여행계획 검색 성공', result: findTour };
  };
  //여행계획 조회
  getTour = async ({ tour_site_id, tour_id }) => {
    if (!tour_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    if (!tour_site_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }
    const findTour = await this.tourRepository.getTour(tour_site_id, tour_id);

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
