const { Place, TourSite, PlanDate } = require('../models');

class PlaceRepository {
  //여행 경로 등록
  createPlace = async ({ user_id, plan_date_id, tour_site_id }) => {
    const createdPlaceData = await Place.create({ user_id, plan_date_id, tour_site_id });
    return createdPlaceData;
  };
  // 여행 경로 조회
  getPlace = async ({ plan_date_id, tour_site_id }) => {
    const places = await Place.findAll({
      where: {
        plan_date_id,
      },
      where: {
        tour_site_id,
      },
    });
    return places;
  };

  // 여행 장소 수정
  updatePlace = async ({ tour_id, plan_date_id, tour_site_id }) => {
    const updatedPlace = await Place.update({ title, content, start_date, end_date }, { where: { id: Place_id } });

    return updatedPlace; // 업데이트 성공 여부 반환
  };

  // 여행 장소 삭제
  deletePlace = async ({ place_id }) => {
    const deletedPlace = await Place.destroy({ where: { id: place_id } });
    return deletedPlace; // 삭제 성공 여부 반환
  };
}

module.exports = PlaceRepository;
