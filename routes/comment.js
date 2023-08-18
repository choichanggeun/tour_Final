const express = require('express');
const commentRouter = express.Router();

const CommentController = require('../controllers/comment.controller');
const commentController = new CommentController();

// 조회
commentRouter.get('/diaries/:diary_id/comments', commentController.findAllComment);

// 작성
commentRouter.post('/diaries/:diary_id/comments', commentController.createComment);

// 수정
commentRouter.put('/comments/:comment_id', commentController.updateComment);

// 삭제
commentRouter.delete('comments/:comment_id', commentController.deleteComment);

module.exports = commentRouter;
