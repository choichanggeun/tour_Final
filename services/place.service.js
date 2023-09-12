const PlaceRepository = require('../repositories/place.repository');

class PlaceService {
  placeRepository = new PlaceRepository();

  // 경유지 작성

  createPlace = async ({ user_id, plan_date_id, tour_site_id, start_time, end_time }) => {
    if (!plan_date_id) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!tour_site_id) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createPlaceData = await this.placeRepository.createPlace({
      user_id,
      plan_date_id,
      tour_site_id,
      start_time,
      end_time,
    });

    if (!createPlaceData) throw { code: 401, message: '경유지 경유지 등록이 실패하였습니다. 않습니다.' };

    return { createPlaceData, code: 200, message: '경유지 경유지 등록이 완료되었습니다.' };
  };
  // 경유지 작성
  createPlaceBytourId = async (user_id, tour_id, days, tour_site_id, start_time, end_time) => {
    const createPlaceData = await this.placeRepository.createPlaceBytourId(tour_id, days, tour_site_id, start_time, end_time);
    if (!createPlaceData) throw { code: 401, message: '경유지 경유지 등록이 실패하였습니다. 않습니다.' };

    return { code: 200, message: '경유지 등록이 완료되었습니다.' };
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

  getPlaceList = async (tour_id, days) => {
    const findPlace = await this.placeRepository.getPlaceList(tour_id, days);
    if (!findPlace) throw { data: null, code: 400, message: '존재하지 않습니다.' };
    const PlaceList = findPlace.map((data) => {
      return {
        id: data.id,
        site_name: data.TourSite.site_name,
        site_address: data.TourSite.site_address,
        site_img: data.TourSite.site_img,
        mapx: data.TourSite.mapx,
        mapy: data.TourSite.mapy,
      };
    });
    return {
      data: PlaceList,
      code: 200,
      message: '경유지 장소 조회가 완료되었습니다.',
    };
  };
  //경유지 장소 수정
  putPlace = async ({ user_id, place_id, plan_date_id, tour_site_id, start_time, end_time }) => {
    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };

    const updatedPlace = await this.placeRepository.updatePlace({ place_id, plan_date_id, tour_site_id, start_time, end_time });

    if (!updatedPlace) throw { code: 400, message: '경유지 장소 수정에 실패했습니다.' };

    return { code: 200, message: '경유지 장소가 성공적으로 수정되었습니다.' };
  };
  //경유지 장소 삭제
  deletePlace = async ({ user_id, place_id }) => {
    if (!place_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.placeRepository.deletePlace({ place_id });
    if (!deletedTour) throw { code: 400, message: '경유지 장소 삭제에 실패했습니다.' };

    return { code: 200, message: '경유지 장소가 성공적으로 삭제되었습니다.' };
  };
}

module.exports = PlaceService;
