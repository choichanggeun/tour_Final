const { Tour, User } = require('../models');

class TourRepository {
  // 여행 계획 등록
  createTour = async ({ user_id, title, content, start_date, end_date }) => {
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error('해당하는 사용자가 없습니다.');
    }
    const createdTourData = await Tour.create({ title, content, start_date, end_date, user_id });

    return createdTourData;
  };

  // 모든 여행 계획 조회
  getTour = async () => {
    const tours = await Tour.findAll();
    return tours;
  };

  // 여행 계획 수정
  updateTour = async ({ tour_id, title, content, start_date, end_date }) => {
    const updatedTour = await Tour.update({ title, content, start_date, end_date }, { where: { id: tour_id } });

    return updatedTour; // 업데이트 성공 여부 반환
  };

  // 여행 계획 삭제
  deleteTour = async ({ tour_id }) => {
    const deletedTour = await Tour.destroy({ where: { id: tour_id } });
    return deletedTour; // 삭제 성공 여부 반환
  };
}

module.exports = TourRepository;
