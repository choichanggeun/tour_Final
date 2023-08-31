const InviteService = require('../services/invite.service');

class InviteController {
  inviteService = new InviteService();

  //투어에 초대된 사용자 조회
  findInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { data, code, message } = await this.inviteService.findInvite({ user_id, tour_id });
      return res.status(code).json({ data, message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 투어에 사용자 초대
  createInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { email } = req.body;
      const { code, message } = await this.inviteService.createInvite({
        tour_id,
        email,
        user_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  deleteInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { invite_id } = req.params;
      const { code, message } = await this.inviteService.deleteInvite({
        user_id,
        invite_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = InviteController;
