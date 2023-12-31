const { PlanDate, User, Tour, Place } = require('../models');
const redisCli = require('./../utils/redis');

class PlanDateRepository {
  //여행 일자 등록
  postPlanDate = async ({ tour_id, days }) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    for (let i = 1; i < days + 1; i++) {
      const plan = await redisCli.lRange(REDIS_PREFIX + tour_id + REDIS_SUFFIX + i, 0, -1);
      const plandate = await PlanDate.create({ tour_id, day: i });
      for (let j = 0; j < plan.length; j++) {
        let value = JSON.parse(plan[j]);
        await Place.create({ tour_site_id: value.site_id, plan_date_id: plandate.id, start_time: value.start_time, end_time: value.end_time });
      }
    }
    await Tour.update({ status: 1 }, { where: { id: tour_id } });
    return { code: 200, message: '여행 계획 생성 완료' };
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
