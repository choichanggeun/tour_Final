const TourSiteService = require('../services/tourSite.service');

class ToursiteController {
  tourSiteService = new TourSiteService();

  // 배너 목록 조회
  getTourSiteList = async (req, res, next) => {
    try {
      const { status, message, result } = await this.tourSiteService.getTourSiteList();
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  createTourSite = async (req, res, next) => {
    try {
      const { admin_id } = res.locals.admin;
      const { status, message, result } = await this.tourSiteService.createTourSite(admin_id);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  initTourSite = async (req, res, next) => {
    try {
      const { admin_id } = res.locals.admin;
      const { status, message, result } = await this.tourSiteService.initTourSite(admin_id);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
}
module.exports = ToursiteController;
