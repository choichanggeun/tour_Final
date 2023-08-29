const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const RedisController = require('../controllers/redis.controller');
const redisController = new RedisController();

router.get('/redis/:key/:day', redisController.getRedis);

router.post('/redis/:key', redisController.createRedis);

router.delete('/redis/:key', redisController.deleteRedis);

module.exports = router;
