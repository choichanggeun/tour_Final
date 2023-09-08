const { Place, TourSite, PlanDate } = require('../models');
const { Op } = require('sequelize');
class PlaceRepository {
  //여행 경로 등록
  createPlace = async ({ user_id, plan_date_id, tour_site_id }) => {
    const createdPlaceData = await Place.create({ user_id, plan_date_id, tour_site_id });
    return createdPlaceData;
  };
  // 여행 경로 조회

  createPlaceBytourId = async (tour_id, days, tour_site_id) => {
    const findPlanDate = await PlanDate.findOne({ where: { [Op.and]: [{ tour_id: tour_id }, { day: days }] } });
    return await Place.create({ tour_site_id, plan_date_id: findPlanDate.id });
  };

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
  // 여행 경로 조회 날짜와 계획에 따른
  getPlaceList = async (tour_id, days) => {
    const Plandate = await PlanDate.findOne({ where: { [Op.and]: [{ tour_id: tour_id }, { day: days }] } });
    if (!Plandate) return false;
    return await Place.findAll({
      where: { plan_date_id: Plandate.id },
      include: [{ model: TourSite }],
    });
  };
  // 여행 장소 수정
  updatePlace = async (place_id, id, start_time, end_time) => {
    const updatedPlace = await Place.update(
      {
        tour_site_id: id,
        start_time: start_time,
        end_time: end_time,
      },
      { where: { id: place_id } }
    );

    return updatedPlace; // 업데이트 성공 여부 반환
  };

  // 여행 장소 삭제
  deletePlace = async ({ place_id }) => {
    const deletedPlace = await Place.destroy({ where: { id: place_id } });
    return deletedPlace; // 삭제 성공 여부 반환
  };
}

module.exports = PlaceRepository;
