const DiaryRepository = require('../repositories/diary.repository');
const { CustomError } = require('../customError.js');

class DiaryService {
  diaryRepository = new DiaryRepository();

  // 여행 일지 작성
  postDiary = async (user_id, tour_id, title, content, status) => {
    if (!user_id) throw new CustomError('로그인이 필요한 기능입니다.', 401);
    if (!title) throw new CustomError('제목을 입력해주세요.', 400);
    if (!content) throw new CustomError('내용을 입력해주세요.', 400);
    const tour = await this.diaryRepository.getTour(tour_id);
    if (!tour) throw new CustomError('존재하지 않는 여행 계획입니다.', 404);

    await this.diaryRepository.postDiary(user_id, tour_id, title, content, status);
  };

  // 여행 일지 조회
  getDiary = async (diary_id) => {
    return await this.diaryRepository.getDiary(diary_id);
  };

  // 내 모든 여행 일지 조회
  getMyDiaries = async (user_id, diary_cursor) => {
    return await this.diaryRepository.getMyDiaries(user_id, diary_cursor);
  };

  // 여행 계획 여행 일지 조회
  getTourDiaries = async (tour_id) => {
    return await this.diaryRepository.getTourDiaries(tour_id);
  };

  // 모든 여행 일지 조회
  getDiaries = async (cursor) => {
    // 조회 확인용
    if (!cursor) {
      return await this.diaryRepository.getDiaries();
    } else {
      // 커서 페이지 네이션
      return await this.diaryRepository.getDiariesCursor(cursor);
    }
  };

  // 여행 일지 검색
  searchDiaries = async (cursor, search_type) => {
    return await this.diaryRepository.searchDiaries(cursor, search_type);
  };

  // 여행 일지 수정
  putDiary = async (user_id, diary_id, title, content, status) => {
    const diary = await this.diaryRepository.getDiary(diary_id);
    if (!diary) throw new CustomError('존재하지 않는 여행 일지입니다.', 404);
    if (diary.user_id !== user_id) throw new CustomError('여행 일지를 수정할 수 있는 권한이 없습니다.', 403);
    if (!title) throw new CustomError('제목을 입력해주세요.', 400);
    if (!content) throw new CustomError('내용을 입력해주세요.', 400);
    await this.diaryRepository.putDiary(diary_id, title, content, status);
  };

  // 여행 일지 삭제
  deleteDiary = async (user_id, diary_id) => {
    const diary = await this.diaryRepository.getDiary(diary_id);
    if (!diary) throw new CustomError('존재하지 않는 여행 일지입니다.', 404);
    if (diary.user_id !== user_id) throw new CustomError('여행 일지를 삭제할 수 있는 권한이 없습니다.', 403);
    await this.diaryRepository.deleteDiary(diary_id);
  };
}

module.exports = DiaryService;
