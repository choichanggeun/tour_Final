const { Tour } = require('../models');

class TourRepository {
  createTour = async ({ title, content, start_date, end_date }) => {
    const createdTourData = await Tour.create({ title, content, start_date, end_date });
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
