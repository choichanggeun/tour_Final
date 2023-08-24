const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

fs.readdirSync('./routes').forEach((routes) => {
  //routes 폴더에있는걸 다실행시킨다
  app.use('/', require(`./routes/${routes}`));
});

//채팅에 필요한 소켓 기본 설정
io.sockets.on('connection', function (socket) {
  socket.emit('connection', {
    type: 'connected',
  });

  socket.on('connection', function (data) {
    if (data.type == 'join') {
      socket.join(data.room);
      socket.room = data.room;

      socket.emit('system', {
        message: '채팅방에 오신 것을 환영합니다.',
      });

      socket.broadcast.to(data.room).emit('system', {
        message: data.name + '님이 접속하셨습니다.',
      });
    }
  });

  socket.on('user', function (data) {
    socket.broadcast.to(socket.room).emit('message', data);
  });
});

http.listen(3000, () => {
  console.log('Connected at 3000');
});
