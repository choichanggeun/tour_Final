const { PlanDate, User, Tour } = require('../models');

class PlanDateRepository {
  //여행 일자 등록
  postPlanDate = async ({ user_id, tour_id, day }) => {
    console.log(user_id, tour_id, day);
    const user = await User.findOne({ where: { id: user_id } });
    const tour = await Tour.findOne({ where: { id: tour_id } });

    if (!user || !tour) {
      throw new Error('해당하는 사용자 또는 여행 정보가 없습니다.');
    }
    const createdPlanDate = await PlanDate.create({ tour_id, day });

    return createdPlanDate;
  };

  // 모든 여행 일자 조회
  getPlanDate = async (tour_id) => {
    const planDate = await PlanDate.findAll({
      where: { tour_id },
      attributes: ['tour_id', 'id', 'day'],
    });

    return planDate;
  };

  // 여행 일자 수정
  putPlanDate = async ({ plan_date_id, day }) => {
    const updatedPlanDate = await PlanDate.update({ day }, { where: { id: plan_date_id } });

    return updatedPlanDate; // 업데이트 성공 여부 반환
  };

  // 여행 일자 삭제
  deletePlanDate = async ({ user_id, plan_date_id }) => {
    const deletedPlanDate = await PlanDate.destroy({ where: { id: plan_date_id } });
    return deletedPlanDate; // 삭제 성공 여부 반환
  };
}

module.exports = PlanDateRepository;
