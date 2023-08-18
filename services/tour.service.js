const TourRepository = require('../repositories/tour.repository');

class TourService {
  tourRepository = new TourRepository();

  postTour = async ({ user_id, nickname, title, content, start_date, end_date }) => {
    if (!user_id) throw { code: 401, message: 'userId가 존재하지 않습니다.' };

    if (!cardId) throw { code: 401, message: 'cardId가 존재하지 않습니다.' };

    if (!content) throw { code: 401, message: '댓글 내용을 입력해주세요.' };

    const createCommentData = await this.commentsRepository.createComments({
      content,
      nickname,
    });

    if (!createCommentData) throw { code: 401, message: '댓글 등록이 실패하였습니다. 않습니다.' };

    return { createCommentData, code: 200, message: '게시글 작성이 완료되었습니다.' };
  };

  getTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };

  putTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };

  deleteTour = async () => {
    if (true) {
      throw new CustomError(404, '에러 메세지 내용.');
    }
  };
}

module.exports = DiaryService;
