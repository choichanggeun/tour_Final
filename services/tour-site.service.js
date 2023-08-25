const TorusiteRepository = require('../repositories/tour-site.repository');
const AdminRepository = require('../repositories/admin.repository');
const { CustomError, ServiceReturn } = require('../customError');

class TourSiteService {
  torusiteRepository = new TorusiteRepository();
  adminRepository = new AdminRepository();

  getTourSiteList = async () => {
    const TourList = await this.torusiteRepository.getTourSiteList();
    return new ServiceReturn('관광지 정보 리스트 불러오기.', 201, TourList);
  };

  searchTourSite = async (search_site) => {
    const TourList = await this.torusiteRepository.searchSiteList(search_site);
    return new ServiceReturn('검색 완료', 201, TourList);
  };
  createTourSite = async (admin_id) => {
    const vailAdmin = await this.adminRepository.findAdminId(admin_id);
    if (!vailAdmin) throw new CustomError('관리자 권한이 존재하지 않습니다.', 403);
    await this.torusiteRepository.createTourSite();
    return new ServiceReturn('관광지 테이블 채우기 성공', 200);
  };

  initTourSite = async (admin_id) => {
    const vailAdmin = await this.adminRepository.findAdminId(admin_id);
    if (!vailAdmin) throw new CustomError('관리자 권한이 존재하지 않습니다.', 403);
    await this.torusiteRepository.initTourSite();
    return new ServiceReturn('관광지 테이블 초기화 성공', 200);
  };
}
module.exports = TourSiteService;
