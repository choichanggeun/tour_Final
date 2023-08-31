const InviteRepository = require('../repositories/invite.repository');

class InviteService {
  inviteRepository = new InviteRepository();

  findInvite = async ({ user_id, tour_id }) => {
    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    const findInvite = await this.inviteRepository.findInvite({ tour_id });

    return { code: 200, data: findInvite };
  };

  createInvite = async ({ tour_id, email, user_id }) => {
    const existsEmail = await this.inviteRepository.findByEmail({ email });
    const existsUserId = await this.inviteRepository.findByUserId({ tour_id, user_id });

    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    if (existsUserId) throw { code: 412, message: '이미 초대된 사용자입니다.' };
    if (!existsEmail) throw { code: 412, message: '초대된 사용자가 존재하지 않습니다.' };

    await this.inviteRepository.createInvite({
      tour_id,
      email,
      user_id,
    });
    return { code: 201, message: '사용자 초대가 완료되었습니다.' };
  };

  deleteInvite = async ({ user_id, invite_id }) => {
    await this.inviteRepository.findById({ user_id, invite_id });

    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    if (!invite_id) throw { code: 412, message: '초대된 사용자가 존재하지 않습니다.' };

    await this.inviteRepository.deleteInvite({
      invite_id,
    });
    return { code: 201, message: '사용자 삭제가 완료되었습니다.' };
  };
}

module.exports = InviteService;
