const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var redis = require('redis');
var redisAdapter = require('socket.io-redis');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

fs.readdirSync('./routes').forEach((routes) => {
  //routes 폴더에있는걸 다실행시킨다
  app.use('/', require(`./routes/${routes}`));
});

http.listen(3000, () => {
  console.log('Connected at 3000');
});

//다중 인스턴스간 데이터 공유
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

// redis 클라이언트 생성
const REDIS_PREFIX = 'CHAT_USER_';
const REDIS_SUFFIX = 'CHAT_ROOM_';
const client = redis.createClient();
(async () => {
  await client.connect();
})();
client.on('error', function (err) {
  console.log('Error ' + err);
});

io.sockets.on('connection', function (socket) {
  socket.emit('connection', {
    type: 'connected',
  });

  socket.on('connection', async function (data) {
    if (data.type == 'join') {
      //채팅방 접속
      socket.join(data.room);
      socket.room = data.room;
      let log = await getChattingLog(data);
      if (log) {
        socket.emit('system', {
          message: '채팅방에 오신 것을 환영합니다.',
          messagelog: log,
        });
      } else {
        socket.emit('system', {
          message: '채팅방에 오신 것을 환영합니다.',
        });
      }

      socket.broadcast.to(data.room).emit('system', {
        message: data.name + '님이 접속하셨습니다.',
      });

      // 접속 종료
      socket.on('disconnect', function () {
        console.log('user disconnected: ', data.name);
        saveChattingData(data); // 함수 연결
      });
    }
  });

  socket.on('user', function (data) {
    client.RPUSH(REDIS_PREFIX + data.id + REDIS_SUFFIX + data.room, data.message);
    client.expire(REDIS_PREFIX + data.id + REDIS_SUFFIX + data.room, 1800); // 해당 redis 유효시간 3600초
    socket.broadcast.to(socket.room).emit('message', data);
  });
});

// 접속 종료하면 redis에 채팅 데이터를 남김
async function saveChattingData(data) {
  try {
    return await client.lRange(REDIS_PREFIX + data.id, 0, -1);
  } catch (error) {
    return console.log(error);
  }
}

async function getChattingLog(data) {
  try {
    const loglist = await client.lRange(REDIS_PREFIX + data.id + REDIS_SUFFIX + data.room, 0, -1);
    return loglist;
  } catch (error) {
    return console.log(error);
  }
}
