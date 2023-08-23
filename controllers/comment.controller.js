const CommentService = require('../services/comment.service');

class CommentController {
  commentService = new CommentService();

  // 댓글 조회
  findComment = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { diary_id } = req.params;
      const { code, data } = await this.commentsService.findComment({ user_id, diary_id });
      res.status(code).json({ data });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '댓글 조회에 실패하였습니다.' });
    }
  };

  // 댓글 생성
  createComment = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      // const { diary_id } = req.params;
      const { content } = req.body;

      const { code, message } = await this.commentsService.createComment({
        user_id,
        // diary_id,
        content,
      });

      res.status(code).json({ message });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '댓글 생성에 실패하였습니다.' });
    }
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { comment_id } = req.params;
      const { content } = req.body;

      const { code, data } = await this.commentsService.updateComment({
        user_id,
        comment_id,
        content,
      });
      res.status(code).json({ data });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '댓글 수정에 실패하였습니다.' });
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { comment_id } = req.params;

      const { code, data } = await this.commentsService.deleteComment({
        user_id,
        comment_id,
      });
      res.status(code).json({ data });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ errormessage: error.message });
      console.log(error);
      throw res.status(500).json({ errormessage: '댓글 삭제에 실패하였습니다.' });
    }
  };
}
module.exports = CommentController;
