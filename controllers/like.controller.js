const LikeService = require('../services/like.service');

class LikeController {
  likeService = new LikeService();

  //좋아요생성
  createLike = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;

      //좋아요 눌렀는지 확인
      const { status, message } = await this.likeService.createLike(user_id, tour_id);
      res.status(status).json({ message: message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '서버 오류' });
    }
  };
  getLikeUser = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;

      const { status, message } = await this.likeService.getLikeUser(user_id, tour_id);
      res.status(status).json({ message: message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '서버 오류' });
    }
  };
  getLikes = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;

      const { data } = await this.likeService.getLikes(user_id);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '서버 오류' });
    }
  };
}

module.exports = LikeController;
