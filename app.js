const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const diaryRouter = require('./routes/diary');
const inviteRouter = require('./routes/invite');
const tourRouter = require('./routes/tour');
const tourSiteRouter = require('./routes/tourSite');
const bannerRouter = require('./routes/banner');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', [adminRouter], [userRouter], [commentRouter], [diaryRouter], [inviteRouter], [tourRouter], [tourSiteRouter], [bannerRouter]);
app.listen(port, () => {
  console.log(port, '번 포트로 서버가 실행되었습니다.');
});
