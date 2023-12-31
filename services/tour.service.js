const TourRepository = require('../repositories/tour.repository');
const InviteRepository = require('../repositories/invite.repository');
class TourService {
  tourRepository = new TourRepository();
  inviteRepository = new InviteRepository();
  // 여행 계획 작성
  createTour = async ({ user_id, title, start_date, end_date, tour_site_id }) => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    if (!title) throw { code: 401, message: '제목을 입력해주세요.' };
    if (!start_date) throw { code: 401, message: '시작 날짜를 입력해주세요.' };
    if (!end_date) throw { code: 401, message: '종료 날짜를 입력해주세요.' };
    if (new Date(start_date) > new Date(end_date)) throw { code: 401, message: '시작 날짜는 마지막 날짜보다 이전이어야 합니다.' };
    if (new Date(start_date).getFullYear() <= year && new Date(start_date).getMonth() + 1 <= month && new Date(start_date).getDate() < date) throw { code: 401, message: '과거의 날짜는 선택할 수 없습니다.' };
    const valiTourInProgress = await this.tourRepository.findTourInProgress(user_id);
    if (valiTourInProgress) throw { result: valiTourInProgress, code: 405, message: '진행 중인 계획 작성이 존재합니다.' };
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
        id: tour.id,
        title: tour.title,
        nickname: tour.User.nickname,
        site_name: tour.TourSite.site_name,
        site_img: tour.TourSite.site_img,
      };
    });
    return { code: 200, message: '여행계획 조회 성공', result: findTourList };
  };

  //좋아요 순으로 여행계획 전체 조회
  getLikeList = async () => {
    const findTour = await this.tourRepository.getLikeList();
    const findTourList = findTour.map((tour) => {
      return {
        id: tour.id,
        title: tour.title,
        nickname: tour.User.nickname,
        site_name: tour.TourSite.site_name,
        site_img: tour.TourSite.site_img,
        likeCount: tour.Likes[0],
      };
    });
    return { code: 200, message: '좋아요 여행계획 조회 성공', result: findTourList };
  };

  searchTour = async (search_data, search_type) => {
    const findTour = await this.tourRepository.searchTour(search_data, search_type);
    return { code: 200, message: '여행계획 검색 성공', result: findTour };
  };
  //여행계획 조회
  getTourData = async ({ user_id }) => {
    if (!user_id) {
      throw { code: 400, message: '유저가 존재하지않습니다.' };
    }

    const findAllTour = await this.tourRepository.getUserTour(user_id);

    return {
      data: findAllTour,
      code: 200,
      message: '여행계획 조회가 완료되었습니다.',
    };
  };
  //여행계획 수정
  putTour = async (user_id, tour_id, title, start_date, end_date) => {
    const valiUser = await this.tourRepository.getTourOne(tour_id);
    if (valiUser.user_id !== user_id) {
      const invitedUser = await this.inviteRepository.findByUserId({ tour_id, user_id });
      if (!invitedUser) throw { code: 400, message: '초대받지 못한 유저입니다.' };
    }
    const oldDate = new Date(start_date);
    const newDate = new Date(end_date);
    let diff = Math.abs(newDate.getTime() - oldDate.getTime());
    diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diff < 0) throw { code: 400, message: '날짜를 다시 확인해주세요.' };

    const updatedTour = await this.tourRepository.updateTour(tour_id, title, start_date, end_date);
    if (!updatedTour) throw { code: 400, message: '여행 계획 수정에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 수정되었습니다.' };
  };
  //여행계획 삭제
  deleteTour = async ({ user_id, tour_id }) => {
    const valiUser = await this.tourRepository.getTourOne(tour_id);
    if (valiUser.user_id !== user_id) {
      const invitedUser = await this.inviteRepository.findByUserId({ tour_id, user_id });
      if (!invitedUser) throw { code: 400, message: '초대받지 못한 유저입니다.' };
    }

    const deletedTour = await this.tourRepository.deleteTour({ user_id, tour_id });
    if (!deletedTour) throw { code: 400, message: '여행 계획 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 계획이 성공적으로 삭제되었습니다.' };
  };

  updateStatus = async (user_id, tour_id) => {
    await this.tourRepository.updateStatus(tour_id);
    return { code: 200, message: '게시 완료' };
  };

  getVerifyTour = async (user_id, tour_id) => {
    const findTour = await this.tourRepository.getVerifyTour(user_id, tour_id);
    return { code: 200, message: '여행계획 조회 성공', data: findTour };
  };

  // 임시 여행계획 작성
  createTempTour = async ({ tour_site_id, user_id, title, start_date, end_date, status }) => {
    const tour = await this.tourRepository.createTestTour({
      tour_site_id,
      user_id,
      title,
      start_date,
      end_date,
      status,
    });

    if (!tour) throw { code: 500, message: '여행 계획 생성에 실패하였습니다.' };

    return tour;
  };
}

module.exports = TourService;
