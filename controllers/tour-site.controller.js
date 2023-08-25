const TourSiteService = require('../services/tour-site.service');

class TourSiteController {
  tourSiteService = new TourSiteService();

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
  searchTourSite = async (req, res, next) => {
    try {
      const { search_site } = req.params;
      console.log(search_site);
      const { status, message, result } = await this.tourSiteService.searchTourSite(search_site);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
  createTourSite = async (req, res, next) => {
    try {
      const admin_id = res.locals.admin.id;
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
      const admin_id = res.locals.admin.id;
      const { status, message, result } = await this.tourSiteService.initTourSite(admin_id);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
}
module.exports = TourSiteController;
