const redis = require('redis');
//Redis 실행
const client = redis.createClient();
(async () => {
  await client.connect();
})();
client.on('error', function (err) {
  console.log('Error ' + err);
});

class RedisRepository {
  createRedis = async (key, data) => {
    return client.set(key, JSON.stringify(data));
  };
}

module.exports = RedisRepository;
