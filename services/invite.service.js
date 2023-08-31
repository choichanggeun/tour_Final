const InviteRepository = require('../repositories/invite.repository');

class InviteService {
  inviteRepository = new InviteRepository();

  findInvite = async ({ user_id, tour_id }) => {
    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    const findInvite = await this.inviteRepository.findInvite({ tour_id });
    const findUser = findInvite.map((user) => {
      return {
        nickname: user.User.nickname,
      };
    });
    return { code: 200, data: findUser };
  };

  createInvite = async ({ tour_id, email, user_id }) => {
    const existsEmail = await this.inviteRepository.findByEmail({ email });
    if (!existsEmail) throw { code: 412, message: '초대된 사용자가 존재하지 않습니다.' };

    const invitedUser = await this.inviteRepository.createInvite({
      tour_id,
      email,
      user_id,
    });
    if (!invitedUser) throw { code: 412, message: '초대 실패' };

    return { code: 201, message: '사용자 초대가 완료되었습니다.', result: existsEmail };
  };

  deleteInvite = async ({ user_id, invite_id }) => {
    const existsInvite = await this.inviteRepository.findById({ user_id, invite_id });

    console.log(invite_id);

    if (!user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    if (!invite_id) throw { code: 412, message: '초대된 사용자가 존재하지 않습니다.' };

    await this.inviteRepository.deleteInvite({
      invite_id,
    });
    return { code: 201, message: '사용자 삭제가 완료되었습니다.' };
  };
}

module.exports = InviteService;
