const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const LikeController = require('../controllers/like.controller');

const likeController = new LikeController();

//좋아요 생성.취소
router.put('/tours/:tour_id/likes', auth, likeController.createLike);

router.get('/tours/:tour_id/likes', auth, likeController.getLikeUser);

router.get('/likes/:tour_id', likeController.getLikes);

module.exports = router;
