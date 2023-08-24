const { Comment } = require('../models');
const { Op } = require('sequelize');

class CommentRepository {
  // 댓글 조회
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

  // 댓글 아이디 찾기
  findById = async ({ user_id, comment_id }) => {
    return await Comment.findOne({ where: { [Op.and]: [{ user_id }, { id: comment_id }] } });
  };

  // 댓글 수정
  updateComment = async ({ comment_id, content }) => {
    const comment = await Comment.update(
      { content },
      {
        where: { id: comment_id },
      }
    );
    return comment;
  };

  // 댓글 삭제
  deleteComment = async ({ comment_id }) => {
    return await Comment.destroy({
      where: { comment_id },
    });
  };
}
module.exports = CommentRepository;
