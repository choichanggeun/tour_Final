require('dotenv').config();

const { MAIL_ID, MAIL_KEY } = process.env;
const nodemailer = require('nodemailer');

module.exports = async function sendMail({ email, title, body }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL_ID, // generated ethereal user
      pass: MAIL_KEY, // generated ethereal password
    },
  });

  await transporter.sendMail({
    from: `Tour Project ~ <${MAIL_ID}>`,
    to: email,
    subject: title,
    html: body,
  });
};
