const { Like } = require('../models');
const { Op } = require('sequelize');
class LikeRepository {
  async createLike(user_id, tour_id) {
    await Like.create({ user_id, tour_id });
  }

  async getLike(user_id, tour_id) {
    return await Like.findOne({ where: { [Op.and]: { user_id: user_id, tour_id: tour_id } } });
  }

  async deleteLike(user_id, tour_id) {
    return await Like.destroy({ where: { user_id, tour_id } });
  }

  async getLikes(user_id) {
    return await Like.findAll({ where: { user_id } });
  }
}

module.exports = LikeRepository;
