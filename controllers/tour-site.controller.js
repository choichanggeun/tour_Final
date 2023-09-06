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
  getTourSite = async (req, res, next) => {
    try {
      const { tour_site_id } = req.params;
      const { status, message, result } = await this.tourSiteService.getTourSite(tour_site_id);
      return res.status(status).json({ message, result });
    } catch (error) {}
  };
  searchTourSite = async (req, res, next) => {
    try {
      const { search_data, search_type } = req.params;
      const { status, message, result } = await this.tourSiteService.searchTourSite(search_data, search_type);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
  getFirstSite = async (req, res, next) => {
    try {
      const { status, message, result } = await this.tourSiteService.getFirstSite();
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  firstTourSite = async (req, res, next) => {
    try {
      const admin_id = res.locals.admin.id;
      const { status, message, result } = await this.tourSiteService.firstTourSite(admin_id);
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
      const { startNumber } = req.body;
      const { status, message, result } = await this.tourSiteService.createTourSite(admin_id, startNumber);
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
