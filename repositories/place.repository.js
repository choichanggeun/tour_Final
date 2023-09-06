const { Place, TourSite, PlanDate } = require('../models');
const { Op } = require('sequelize');
class PlaceRepository {
  //여행 경로 등록
  createPlace = async ({ user_id, plan_date_id, tour_site_id, start_time, end_time }) => {
    const createdPlaceData = await Place.create({ user_id, plan_date_id, tour_site_id, start_time, end_time });
    return createdPlaceData;
  };
  // 여행 경로 조회

<<<<<<< HEAD
  createPlaceBytourId = async (tour_id, days, tour_site_id, start_time, end_time) => {
    console.log(tour_id, days, tour_site_id, start_time, end_time);
=======
  createPlaceBytourId = async (tour_id, days, tour_site_id) => {
>>>>>>> b964c292b9adf84c5eb34407032c74534aa4e00c
    const findPlanDate = await PlanDate.findOne({ where: { [Op.and]: [{ tour_id: tour_id }, { day: days }] } });
    return await Place.create({ tour_site_id, plan_date_id: findPlanDate.id, start_time, end_time });
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
  updatePlace = async (id, place_id, start_time, end_time) => {
    const updatedPlace = await Place.update(
      {
        tour_site_id: id,
        start_time,
        end_time,
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
