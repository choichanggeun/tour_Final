const PlanDateRepository = require('../repositories/plandate.repository');

class PlanDateService {
  planDateRepository = new PlanDateRepository();

  // 여행 일자 작성

  postPlanDate = async ({ user_id, tour_id, days }) => {
    if (!days) throw { code: 401, message: '여행 일자를 입력해주세요.' };

    const { code, message } = await this.planDateRepository.postPlanDate({ tour_id, days });

    return { code: code, message: message };
  };
  //여행 장소 조회
  getPlanDate = async ({ tour_id }) => {
    // 매개변수 객체로 수정
    if (!tour_id) {
      throw { data, code: 400, message: '실패하였습니다.' };
    }

    const findPlan = await this.planDateRepository.getPlanDate(tour_id);

    return {
      data: findPlan,
      code: 200,
      message: '여행 장소 조회가 완료되었습니다.',
    };
  };
  //여행 장소 수정
  putPlanDate = async ({ user_id, plan_date_id, day }) => {
    if (!plan_date_id) throw { code: 400, message: 'plan_date_id가 필요합니다.' };

    const updatedPlace = await this.planDateRepository.putPlanDate({
      user_id,
      plan_date_id,
      day,
    });

    if (!updatedPlace) throw { code: 400, message: '여행 장소 수정에 실패했습니다.' };

    return { code: 200, message: '여행 장소가 성공적으로 수정되었습니다.' };
  };
  //여행 장소 삭제
  deletePlanDate = async ({ user_id, plan_date_id }) => {
    if (!plan_date_id) throw { code: 400, message: 'plan_date_id가 필요합니다.' };

    const deletedPlanDate = await this.planDateRepository.deletePlanDate({ user_id, plan_date_id });

    if (!deletedPlanDate) throw { code: 400, message: '여행 일정 삭제에 실패했습니다.' };

    return { code: 200, message: '여행 일정이 성공적으로 삭제되었습니다.' };
  };
}

module.exports = PlanDateService;
