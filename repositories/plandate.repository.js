const { PlanDate, User, Tour, Place } = require('../models');
const redis = require('redis');
//Redis 실행
const client = redis.createClient();
(async () => {
  await client.connect();
})();
client.on('error', function (err) {
  console.log('Error ' + err);
});

class PlanDateRepository {
  //여행 일자 등록
  postPlanDate = async ({ tour_id, days }) => {
    const REDIS_PREFIX = 'KEY_';
    const REDIS_SUFFIX = 'DAY_';
    for (let i = 1; i < days + 1; i++) {
      const plan = await client.lRange(REDIS_PREFIX + tour_id + REDIS_SUFFIX + i, 0, -1);
      const plandate = await PlanDate.create({ tour_id, day: i });
      for (let j = 0; j < plan.length; j++) {
        await Place.create({ tour_site_id: plan[j], plan_date_id: plandate.id });
      }
    }
    await Tour.update({ status: 1 }, { where: { id: tour_id } });
    return true;
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
