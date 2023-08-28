const { Like } = require('../models');

class LikeRepository {
  
  async createLike(user_id, tour_id) {
    await Like.create({ user_id, tour_id });
  }

  async getLike(user_id, tour_id) {
    await Like.findOne({where: {user_id, tour_id}});
  }

  async deleteLike(user_id, tour_id) {
    await Like.destroy({where: { user_id, tour_id }});
  }

  async getLikes(user_id) {
    return await Like.findAll({where: { user_id}});
  }
}

module.exports = LikeRepository;