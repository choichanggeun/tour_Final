const { Server } = require('socket.io');
var client = require('./redis');

let io;
const REDIS_PREFIX = 'CHAT_USER_';
const REDIS_SUFFIX = 'CHAT_ROOM_';

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

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer);

    io.sockets.on('connection', function (socket) {
      socket.emit('connection', { type: 'connected' });

      socket.on('new_plan', function (plan) {
        //모든 클라이언트에게 새로운 여행 계획 전송
        io.emit('update_plan', plan);
      });

      socket.on('search_start', function (data) {
        socket.broadcast.emit('search_start', data);
      });

      socket.on('search_end', function (data) {
        socket.broadcast.emit('search_end', data);
      });

      socket.on('update_search', function (data) {
        io.to(data.room).emit('update_search', data);
      });

      socket.on('plan_updated', function (data) {
        io.to(data.room).emit('plan_updated', data);
      });

      socket.on('connection', async function (data) {
        if (data.type == 'join') {
          //채팅방 접속
          socket.join(data.room);
          socket.room = data.room;

          let log = await getChattingLog(data);

          if (log) socket.emit('system', { message: '채팅방에 오신 것을 환영합니다.', messagelog: log });
          else socket.emit('system', { message: '채팅방에 오신 것을 환영합니다.' });

          socket.broadcast.to(data.room).emit('system', { message: data.name + '님이 접속하셨습니다.' });

          //접속 종료
          socket.on('disconnect', function () {
            console.log('user disconnected: ', data.name);
            saveChattingData(data); //함수 연결
          });
        }
      });

      socket.on('user', function (data) {
        io.to(data.room).emit('message', data);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
