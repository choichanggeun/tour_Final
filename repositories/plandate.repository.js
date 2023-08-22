const { PlanDate } = require('../models');

class PlanDateRepository {
  //여행 장소 등록
  createPlanDate = async ({ title, content, start_date, end_date }) => {
    const createdPlaceData = await PlanDate.create({ title, content, start_date, end_date });
    return createdPlaceData;
  };
  // 모든 여행 장소 조회
  getPlanDate = async () => {
    const getAllPlanDate = await PlanDate.findAll();
    return getAllPlanDate;
  };

  // 여행 장소 수정
  putPlanDate = async ({ Place_id, title, content, start_date, end_date }) => {
    const updatedPlanDate = await PlanDate.update({ title, content, start_date, end_date }, { where: { id: Place_id } });

    return updatedPlanDate; // 업데이트 성공 여부 반환
  };

  // 여행 장소 삭제
  deletePlanDate = async ({ Place_id }) => {
    const deletedPlanDate = await PlanDate.destroy({ where: { id: Place_id } });
    return deletedPlanDate; // 삭제 성공 여부 반환
  };
}

module.exports = PlanDateRepository;
