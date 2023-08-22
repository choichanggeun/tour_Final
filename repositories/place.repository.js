const { Place } = require('../models');

class PlaceRepository {
  //여행 장소 등록
  createPlace = async ({ title, content, start_date, end_date }) => {
    const createdPlaceData = await Place.create({ title, content, start_date, end_date });
    return createdPlaceData;
  };
  // 모든 여행 장소 조회
  getPlace = async () => {
    const places = await Place.findAll();
    return places;
  };

  // 여행 장소 수정
  updatePlace = async ({ Place_id, title, content, start_date, end_date }) => {
    const updatedPlace = await Place.update({ title, content, start_date, end_date }, { where: { id: Place_id } });

    return updatedPlace; // 업데이트 성공 여부 반환
  };

  // 여행 장소 삭제
  deletePlace = async ({ Place_id }) => {
    const deletedPlace = await Place.destroy({ where: { id: Place_id } });
    return deletedPlace; // 삭제 성공 여부 반환
  };
}

module.exports = PlaceRepository;
