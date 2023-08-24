const PlaceRepository = require('../repositories/place.repository');

class PlaceService {
  placeRepository = new PlaceRepository();

  // 경유지 작성

  createPlace = async ({ user_id, plan_date_id, tour_site_id }) => {
    if (!plan_date_id) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!tour_site_id) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createPlaceData = await this.placeRepository.createPlace({
      user_id,
      plan_date_id,
      tour_site_id,
    });

    if (!createPlaceData) throw { code: 401, message: '경유지 경유지 등록이 실패하였습니다. 않습니다.' };

    return { createPlaceData, code: 200, message: '경유지 경유지 등록이 완료되었습니다.' };
  };

  //경유지 장소 조회
  getPlace = async ({ plan_date_id, tour_site_id }) => {
    if (!plan_date_id || !tour_site_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    const findPlace = await this.placeRepository.getPlace({ plan_date_id, tour_site_id });

    return {
      data: findPlace,
      code: 200,
      message: '경유지 장소 조회가 완료되었습니다.',
    };
  };
  //경유지 장소 수정
  putPlace = async ({ plan_date_id, tour_site_id, user_id, place_id }) => {
    if (!plan_date_id) throw { code: 400, message: 'plan_date_id가 필요합니다.' };

    if (!tour_site_id) throw { code: 400, message: 'tour_site_id가 필요합니다.' };

    const updatedPlace = await this.placeRepository.updatePlace({
      plan_date_id,
      tour_site_id,
      user_id,
      place_id,
    });

    if (!updatedPlace) throw { code: 400, message: '경유지 장소 수정에 실패했습니다.' };

    return { code: 200, message: '경유지 장소가 성공적으로 수정되었습니다.' };
  };
  //경유지 장소 삭제
  deletePlace = async ({ user_id, place_id }) => {
    if (!place_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.placeRepository.deletePlace({ place_id });
    console.log(deletedTour);
    if (!deletedTour) throw { code: 400, message: '경유지 장소 삭제에 실패했습니다.' };

    return { code: 200, message: '경유지 장소가 성공적으로 삭제되었습니다.' };
  };
}

module.exports = PlaceService;
