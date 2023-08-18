const { Comment } = require('../models');

class CommentRepository {
  //댓글 조회
  findComment = async ({ diary_id }) => {
    return await Comment.findAll({
      where: { diary_id },
    });
  };

  // 댓글 생성
  createComment = async ({ user_id, diary_id, content }) => {
    return await Comment.create({
      user_id,
      diary_id,
      content,
    });
  };

  // 댓글 수정
  updateComment = async ({ comment_id, content }) => {
    await Comment.update(
      { content },
      {
        where: { comment_id },
      }
    );
  };

  // 댓글 삭제
  deleteComment = async ({ comment_id }) => {
    await Comment.destroy({
      where: { comment_id },
    });
  };
}
module.exports = CommentRepository;
