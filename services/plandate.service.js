const PlanDateRepository = require('../repositories/plandate.repository');

class PlanDateService {
  planDateRepository = new PlanDateRepository();

  // 여행 계획 작성

  createPlanDate = async ({ title, start_date, end_date }) => {
    if (!title) throw { code: 401, message: 'title을 입력해주세요.' };

    if (!start_date) throw { code: 401, message: 'start_date 입력해주세요.' };

    if (!end_date) throw { code: 401, message: 'end_date 입력해주세요.' };

    const createPlanDateData = await this.planDateRepository.createPlanDate({
      title,
      start_date,
      end_date,
    });

    if (!createPlanDateData) throw { code: 401, message: '여행 장소 등록이 실패하였습니다.' };

    return { createPlanDateData, code: 200, message: '여행 장소 작성이 완료되었습니다.' };
  };
  //여행 장소 조회
  getPlanDate = async ({ tour_id }) => {
    // 매개변수 객체로 수정
    if (!tour_id) {
      throw { code: 400, message: '실패하였습니다.' };
    }

    const findTour = await this.planDateRepository.getPlanDate(tour_id);

    return {
      findTour,
      code: 200,
      message: '여행 장소 조회가 완료되었습니다.',
    };
  };
  //여행 장소 수정
  putPlanDate = async ({ tour_id, title, start_date, end_date }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const updatedPlace = await this.planDateRepository.putPlanDate({
      tour_id,
      title,
      start_date,
      end_date,
    });

    if (!updatedPlace) throw { code: 400, message: '여행 장소 수정에 실패했습니다.' };

    return { code: 200, message: '여행 장소가 성공적으로 수정되었습니다.' };
  };
  //여행 장소 삭제
  deletePlanDate = async ({ tour_id }) => {
    if (!tour_id) throw { code: 400, message: 'tour_id가 필요합니다.' };

    const deletedTour = await this.planDateRepository.deletePlanDate({ tour_id });

    if (!deletedTour) throw { code: 400, message: '여행 장소 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 장소가 성공적으로 삭제되었습니다.' };
  };
}

module.exports = PlanDateService;
