const BannerService = require('../services/banner.service');

class BannerController {
  bannerService = new BannerService();

  // 배너 목록 조회
  getBannerList = async (req, res, next) => {
    try {
      const { status, message, result } = await this.bannerService.getBannerList();
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  createBanner = async (req, res, next) => {
    try {
      const admin_id = 1;
      let image = req.file.filename;
      const img = image;
      const { status, message, result } = await this.bannerService.createBanner(admin_id, img);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  updateBanner = async (req, res, next) => {
    try {
      const admin_id = res.locals.admin.id;
      const { banner_id } = req.params;
      let image = req.file;
      const img = image;
      const { status, message, result } = await this.bannerService.updateBanner(admin_id, banner_id, img);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  deleteBanner = async (req, res, next) => {
    try {
      const admin_id = res.locals.admin.id;
      const { banner_id } = req.params;
      const { status, message, result } = await this.bannerService.deleteBanner(admin_id, banner_id);
      return res.status(status).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };
}
module.exports = BannerController;
