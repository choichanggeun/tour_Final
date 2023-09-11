const { Server } = require('socket.io');
var redis = require('redis');
var redisAdapter = require('socket.io-redis');

let io;
const REDIS_PREFIX = 'CHAT_USER_';
const REDIS_SUFFIX = 'CHAT_ROOM_';
let client;

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
    client = redis.createClient();
    (async () => {
      await client.connect();
    })();
    client.on('error', function (err) {
      console.log('Error ' + err);
    });

    io = new Server(httpServer);

    //다중 인스턴스간 데이터 공유
    io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

    io.sockets.on('connection', function (socket) {
      socket.on('new_plan', function (plan) {
        //모든 클라이언트에게 새로운 여행 계획 전송
        io.emit('update_plan', plan);
      });
      //... your connection event handling code here ...
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },

  saveChattingData,

  getChattingLog,
};
