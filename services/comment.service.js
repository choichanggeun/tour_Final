const CommentRepository = require('../repositories/comment.repository');

class CommentService {
  commentRepository = new CommentRepository();

  // 댓글 조회
  findComment = async ({ diary_id }) => {
    const findComment = await this.commentRepository.findComment({ diary_id });

    return { code: 200, data: findComment };
  };

  // 댓글 생성
  createComment = async ({ user_id, diary_id, content }) => {
    const createdComment = await this.commentRepository.createComment({
      user_id,
      diary_id,
      content,
    });

    // 데이터가 정상적으로 전달되지 못한 경우
    if (!createdComment.user_id) throw { code: 403, message: '로그인이 필요한 기능입니다.' };

    if (createdComment.user_id !== user_id) throw { code: 412, message: '댓글을 생성할 사용자가 존재하지 않습니다.' };

    return { code: 201, message: '댓글 생성이 완료되었습니다.' };
  };

  // 댓글 수정
  updateComment = async ({ user_id, comment_id, content }) => {
    const existsComment = await this.commentRepository.findById({
      user_id,
      comment_id,
    });

    if (!existsComment.user_id) {
      throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    } else if (existsComment.user_id !== user_id) {
      throw { code: 412, message: '댓글을 수정할 권한이 존재하지 않습니다.' };
    }

    // 댓글의 권한을 확인하고, 댓글 수정

    const data = await this.commentRepository.updateComment({
      comment_id,
      content,
    });

    return { code: 200, message: '댓글 수정이 완료되었습니다.' };
  };

  // 댓글 삭제
  deleteComment = async ({ user_id, comment_id }) => {
    const existsComment = await this.commentRepository.findById({
      user_id,
      comment_id,
    });

    if (!existsComment.user_id) {
      throw { code: 403, message: '로그인이 필요한 기능입니다.' };
    } else if (existsComment.user_id !== user_id) {
      throw { code: 412, message: '댓글을 삭제할 권한이 존재하지 않습니다.' };
    }

    await this.commentRepository.deleteComment({
      comment_id,
    });
    return { code: 201, message: '댓글 삭제가 완료되었습니다.' };
  };
}
module.exports = CommentService;
