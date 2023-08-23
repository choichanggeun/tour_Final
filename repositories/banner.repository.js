const { Banner } = require('../models');

class BannerRepository {
  findBannerId = async (banner_id) => {
    return await Banner.findOne({ where: { id: banner_id } });
  };

  getBannerList = async () => {
    return await Banner.findAll();
  };

  createBanner = async (admin_id, img) => {
    return await Banner.create({ admin_id, img });
  };

  updateBanner = async (banner_id, img) => {
    await Banner.update({ img }, { where: { id: banner_id } });
  };

  deleteBanner = async (banner_id) => {
    return await Banner.destroy({ where: { id: banner_id } });
  };
}

module.exports = BannerRepository;
