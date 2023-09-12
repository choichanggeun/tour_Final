const LikeRepository = require('../repositories/like.repository');

class LikeService {
  likeRepository = new LikeRepository();
  //좋아요 생성
  async createLike(user_id, tour_id) {
    const like = await this.likeRepository.getLike(user_id, tour_id);

    // 좋아요 있으면 삭제
    if (like) {
      await this.likeRepository.deleteLike(user_id, tour_id);
      return { status: 200, message: '좋아요가 삭제되었습니다.' };
    } else {
      // 새로운 좋아요 생성
      await this.likeRepository.createLike(user_id, tour_id);
      return { status: 201, message: '좋아요 등록에 성공하였습니다.' };
    }
  }
  getLikeUser = async (user_id, tour_id) => {
    const likeCheck = await this.likeRepository.getLike(user_id, tour_id);
    if (likeCheck) {
      return { status: 201, message: '좋아요를 한 유저입니다.' };
    }
    return { status: 201, message: '좋아요를 하지않은 유저입니다.' };
  };

  async getLikes(tour_id) {
    const data = await this.likeRepository.getLikes(tour_id);
    return { data };
  }
}

module.exports = LikeService;
