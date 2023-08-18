const CommentService = require('../services/comment.service');

class CommentController {
  commentService = new CommentService();

  // 댓글 전체 조회
  findAllComment = async (req, res) => {
    const { comment_id } = req.params;

    const { code, data } = await this.commentsService.findAllComment({ comment_id });
    res.status(code).json({ data });
  };

  // 댓글 조회
  findComment = async (req, res) => {
    const { comment_id } = req.params;

    const { code, data } = await this.commentsService.findComment({ comment_id });
    res.status(code).json({ data });
  };

  // 댓글 생성
  createComment = async (req, res) => {
    const { user_id } = res.locals.user;
    const { comment_id } = req.params;
    const { content } = req.body;

    const { code, data } = await this.commentsService.createComment({
      user_id,
      comment_id,
      content,
    });

    res.status(code).json({ data });
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    const { user_id } = res.locals.user;
    const { comment_id } = req.params;
    const { content } = req.body;

    const { code, data } = await this.commentsService.updateComment({
      user_id,
      comment_id,
      content,
    });
    res.status(code).json({ data });
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    const { user_id } = res.locals.user;
    const { comment_id } = req.params;

    const { code, data } = await this.commentsService.deleteComment({
      user_id,
      comment_id,
    });
    res.status(code).json({ data });
  };
}
module.exports = CommentController;
