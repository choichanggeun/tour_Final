const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

const adminRouter = require('./routes/admin.route');
const userRouter = require('./routes/user.route');
const commentRouter = require('./routes/comment.route');
const diaryRouter = require('./routes/diary.route');
const inviteRouter = require('./routes/invite.route');
const tourRouter = require('./routes/tour.route');
const tourSiteRouter = require('./routes/tour-site.route');
const bannerRouter = require('./routes/banner.route');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', [adminRouter], [userRouter], [commentRouter], [diaryRouter], [inviteRouter], [tourRouter], [tourSiteRouter], [bannerRouter]);
app.listen(port, () => {
  console.log(port, '번 포트로 서버가 실행되었습니다.');
});
