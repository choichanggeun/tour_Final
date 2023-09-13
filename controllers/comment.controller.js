const CommentService = require('../services/comment.service');

class CommentController {
  commentService = new CommentService();

  // 댓글 조회
  findComment = async (req, res) => {
    try {
      const { diary_id } = req.params;
      const { code, data } = await this.commentService.findComment({ diary_id });

      res.status(code).json({ data });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 댓글 생성
  createComment = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { diary_id } = req.params;
      const { content } = req.body;

      const { code, message } = await this.commentService.createComment({
        user_id,
        diary_id,
        content,
      });

      return res.status(code).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { comment_id } = req.params;
      const { content } = req.body;

      const { code, message } = await this.commentService.updateComment({
        user_id,
        comment_id,
        content,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    try {
      const user_id = res.locals.user.id;
      const { comment_id } = req.params;

      const { code, message } = await this.commentService.deleteComment({
        user_id,
        comment_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.status) return res.status(err.status).json({ message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
}
module.exports = CommentController;
