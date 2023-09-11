const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);

var redis = require('redis');
var redisAdapter = require('socket.io-redis');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const { init } = require('./utils/io'); // socket I.O 서버 초기화 미들웨어 설정 밑에 넣어줘야함
init(http); //socket.io 초기화

fs.readdirSync('./routes').forEach((routes) => {
  //routes 폴더에있는걸 다실행시킨다
  app.use('/', require(`./routes/${routes}`));
});

http.listen(3000, () => {
  console.log('Connected at 3000');
});
