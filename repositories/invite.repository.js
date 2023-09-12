const { Invite, User } = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config(); //환경변수를 관리하는 구성패키지
const { MAIL_ID, MAIL_KEY, ACCESS_SECRET } = process.env;

class InviteRepository {
  findInvite = async ({ tour_id }) => {
    return await Invite.findAll({
      where: { tour_id },
      include: [{ model: User, attributes: ['nickname'] }],
    });
  };

  inviteEmail = async ({ tour_id, email, user_id, tour_site_id }) => {
    const invitedUser = await User.findOne({ where: { email: email } });
    const inviteUser = await User.findOne({ where: { id: user_id } });
    const inviteTokenFirst = jwt.sign({ id: invitedUser.id, email: invitedUser.email, tour_id, tour_site_id }, ACCESS_SECRET, { expiresIn: '20m' });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_ID, // generated ethereal user
        pass: MAIL_KEY, // generated ethereal password
      },
    });
    const url = `http://localhost:3000/invitecheck/?token=${inviteTokenFirst}`;
    await transporter.sendMail({
      from: `그룹 초대 메일 ~ <${inviteUser.nickname}>님의 초대입니다.`,
      to: email,
      subject: '[Tour Project] 그룹 초대 메일입니다.',
      html: '<p>아래 링크를 누르면 그룹으로 초대됩니다.</p>' + '<a href=' + url + '>초대링크</a>',
    });
  };

  createInvite = async ({ tour_id, user_id }) => {
    //tour_id 와 user_id를 가진 초대 정보가 있는 지 확인 후 이미 초대 된 유저이면
    //에러 발생

    const existingInvite = await Invite.findOne({ where: { tour_id, user_id } });

    if (existingInvite) {
      throw { code: 409, message: 'The user has already been invited.' };
    }
    return await Invite.create({ tour_id, user_id });
  };

  findById = async ({ user_id, invite_id }) => {
    return await Invite.findOne({ where: { id: invite_id } });
  };

  findByEmail = async ({ email }) => {
    return await User.findOne({ where: { email: email } });
  };

  findByUserId = async ({ tour_id, user_id }) => {
    return await Invite.findOne({ where: { tour_id, user_id } });
  };

  deleteInvite = async ({ invite_id }) => {
    return await Invite.destroy({
      where: { id: invite_id },
    });
  };
}
module.exports = InviteRepository;
