const express = require('express');
const router = express.Router();

const RedisController = require('../controllers/redis.controller');
const redisController = new RedisController();

// router.get('/redis/:key', redisController.getRedis);

router.post('/redis/:key', redisController.createRedis);

module.exports = router;
