const InviteService = require('../services/invite.service');

class InviteController {
  inviteService = new InviteService();

  //투어에 초대된 사용자 조회
  findInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { code, data } = await this.inviteService.findInvite({ user_id, tour_id });

      return res.status(code).json({ code, data });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '초대된 사용자 조회에 실패하였습니다.' });
    }
  };

  // 투어에 사용자 초대
  createInvite = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { inviteEmail: email } = req.body;
      const { code, message, result } = await this.inviteService.createInvite({
        tour_id,
        email,
        user_id,
      });

      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '초대된 사용자 생성에 실패하였습니다.' });
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
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '초대된 사용자 삭제에 실패하였습니다.' });
    }
  };
}

module.exports = InviteController;
