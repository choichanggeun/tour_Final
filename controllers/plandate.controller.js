const PlanDateService = require('../services/plandate.service');

class PlanDateController {
  planDateService = new PlanDateService();

  // 여행 일자 등록
  postPlanDate = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { days } = req.body;
      const { code, message } = await this.planDateService.postPlanDate({ user_id, tour_id, days });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 여행 일자 조회
  getPlanDate = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { data, code, message } = await this.planDateService.getPlanDate({ tour_id });
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };
  // 여행 일자 수정
  putPlanDate = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { plan_date_id } = req.params;
      const { day } = req.body;
      const { code, message } = await this.planDateService.putPlanDate({
        user_id,
        plan_date_id,
        day,
      });

      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };
  // 여행 일자 삭제
  deletePlanDate = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { plan_date_id } = req.params;
      const { code, message } = await this.planDateService.deletePlanDate({
        user_id,
        plan_date_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };
}
module.exports = PlanDateController;
