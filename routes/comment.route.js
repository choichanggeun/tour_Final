const express = require('express');
const commentRouter = express.Router();

const CommentController = require('../controllers/comment.controller');
// const Auth = require('../middlewares/auth');
const commentController = new CommentController();

// 댓글 조회
commentRouter.get('/diaries/:diary_id/comments', commentController.findComment);

// 댓글 작성
commentRouter.post('/diaries/comments', commentController.createComment);

// 댓글 수정
commentRouter.put('/comments/:comment_id', commentController.updateComment);

// 댓글 삭제
commentRouter.delete('comments/:comment_id', commentController.deleteComment);

module.exports = commentRouter;
