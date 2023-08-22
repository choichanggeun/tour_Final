const PlanDateService = require('../services/tour-site.service');

class PlanDateController {
  planDateService = new PlanDateService();

  // 여행 일자 등록
  createPlanDate = async (req, res, next) => {
    try {
      const admin_id = res.locals.admin.id;
      const { status, message, result } = await this.planDateService.createPlanDate(admin_id);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 여행 일자 조회
  getPlanDate = async (req, res, next) => {
    try {
      const { status, message, result } = await this.PlanDateService.getPlanDate();
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 여행 일자 수정
  putPlanDate = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { title, start_date, end_date } = req.body; //
      const { code, message } = await this.PlanDateService.putPlanDate({
        title,
        start_date,
        end_date,
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
      // const {user_id} = req.locals.user; 유저 부분 작성되면 수정 할 예정
      const { tour_id } = req.params;
      const { code, message } = await this.PlanDateService.deletePlanDate({
        tour_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };
}
module.exports = PlanDateController;
