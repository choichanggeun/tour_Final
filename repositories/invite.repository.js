const { Invite, User } = require('../models');
const { Op } = require('sequelize');

class InviteRepository {
  findInvite = async ({ tour_id }) => {
    return await Invite.findAll({
      where: { tour_id },
    });
  };

  createInvite = async ({ tour_id, email }) => {
    const user = await User.findOne({ where: { email: email } });
    return await Invite.create({
      user_id: user.id,
      tour_id,
    });
  };

  findById = async ({ user_id, invite_id }) => {
    return await Invite.findOne({ where: { [Op.and]: [{ user_id }, { id: invite_id }] } });
  };

  deleteInvite = async ({ invite_id }) => {
    return await Invite.destroy({
      where: { id: invite_id },
    });
  };
}
module.exports = InviteRepository;
