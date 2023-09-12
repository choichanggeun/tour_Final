const InviteService = require('../services/invite.service');
require('dotenv').config(); //환경변수를 관리하는 구성패키지
const { ACCESS_SECRET } = process.env;
const jwt = require('jsonwebtoken');

class InviteController {
  inviteService = new InviteService();

  //투어에 초대된 사용자 조회
  findInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { code, data } = await this.inviteService.findInvite({ user_id, tour_id });

      return res.status(code).json({ code, data });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 투어에 사용자 초대
  inviteEmail = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { inviteEmail: email, tour_site_id } = req.body;
      const { code, message, result } = await this.inviteService.inviteEmail({
        tour_id,
        email,
        user_id,
        tour_site_id,
      });
      return res.status(code).json({ message, result });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      throw res.status(500).json({ message: err.message });
    }
  };

  createInvite = async (req, res) => {
    try {
      const inviteToken = req.query.token;
      const inviteData = jwt.verify(inviteToken, ACCESS_SECRET);
      const { code, message, link } = await this.inviteService.createInvite({
        tour_id: inviteData.tour_id,
        user_id: inviteData.id,
        tour_site_id: inviteData.tour_site_id,
      });
      return res.status(code).json({ code, message, link });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      throw res.status(500).json({ message: err.message });
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
