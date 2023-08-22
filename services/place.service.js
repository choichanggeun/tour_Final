const PlaceRepository = require('../repositories/place.repository');

class PlaceService {
  placeRepository = new PlaceRepository();

  // 여행 계획 작성

  createPlace = async ({ title, start_date, end_date }) => {
    if (!title) throw { code: 401, message: 'title을 입력해주세요.' };

    if (!start_date) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!end_date) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createPlaceData = await this.placeRepository.createPlace({
      title,
      start_date,
      end_date,
    });

    if (!createPlaceData) throw { code: 401, message: '여행 장소 등록이 실패하였습니다. 않습니다.' };

    return { createPlaceData, code: 200, message: '여행 장소 작성이 완료되었습니다.' };
  };
  //여행 장소 조회
  getPlace = async ({ tour_id }) => {
    // 매개변수 객체로 수정
    if (!tour_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    const findTour = await this.placeRepository.getPlace(tour_id);

    return {
      findTour,
      code: 200,
      message: '여행 장소 조회가 완료되었습니다.',
    };
  };
  //여행 장소 수정
  putPlace = async ({ tour_id, title, start_date, end_date }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const updatedPlace = await this.placeRepository.updatePlace({
      tour_id,
      title,
      start_date,
      end_date,
    });

    if (!updatedPlace) throw { code: 400, message: '여행 장소 수정에 실패했습니다.' };

    return { code: 200, message: '여행 장소가 성공적으로 수정되었습니다.' };
  };
  //여행 장소 삭제
  deletePlace = async ({ tour_id }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.placeRepository.deletePlace({ tour_id });

    if (!deletedTour) throw { code: 400, message: '여행 장소 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 장소가 성공적으로 삭제되었습니다.' };
  };
}

module.exports = PlaceService;
