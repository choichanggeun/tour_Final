const BannerRepository = require('../repositories/banner.repository');
const AdminRepository = require('../repositories/admin.repository');
const { CustomError, ServiceReturn } = require('../customError');
const dayjs = require('dayjs');

class BannerService {
  bannerRepository = new BannerRepository();
  adminRepository = new AdminRepository();
  getBannerList = async () => {
    const bannerList = await this.bannerRepository.getBannerList();
    const cuttingBannerList = bannerList.map((banner) => {
      return {
        id: banner.id,
        img: banner.img,
        time: dayjs().diff(new Date(banner.createdAt), 'm'),
      };
    });
    return new ServiceReturn('배너 리스트 불러오기.', 201, cuttingBannerList);
  };

  createBanner = async (admin_id, img) => {
    await this.bannerRepository.createBanner(admin_id, img);
    return new ServiceReturn('배너 생성 성공', 200);
  };

  updateBanner = async (admin_id, banner_id, img) => {
    const vailAdmin = await this.adminRepository.findAdminId(admin_id);
    if (!vailAdmin) throw new CustomError('관리자 권한이 존재하지 않습니다.', 403);
    const vailBanner = await this.bannerRepository.findBannerId(banner_id);
    if (!vailBanner) throw new CustomError('존재하지 않는 배너입니다.', 403);
    await this.bannerRepository.updateBanner(banner_id, img);
    return new ServiceReturn('배너 수정 성공', 200);
  };

  deleteBanner = async (admin_id, banner_id) => {
    const vailAdmin = await this.adminRepository.findAdminId(admin_id);
    if (!vailAdmin) throw new CustomError('관리자 권한이 존재하지 않습니다.', 403);
    const vailBanner = await this.bannerRepository.findBannerId(banner_id);
    if (!vailBanner) throw new CustomError('존재하지 않는 배너입니다.', 403);

    await this.bannerRepository.deleteBanner(banner_id);
    return new ServiceReturn('배너 삭제 성공', 200);
  };
}
module.exports = BannerService;
