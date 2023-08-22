const DiaryRepository = require('../repositories/diary.repository');

class DiaryService {
  diaryRepository = new DiaryRepository();

  // 여행 일지 작성
  postDiary = async (user_id, tour_id, title, content, diary_img) => {
    await this.diaryRepository.postDiary(user_id, tour_id, title, content, diary_img);
  };

  // 내 여행 일지 조회
  getDiary = async (user_id) => {
    return await this.diaryRepository.getDiary(user_id);
  };

  // 여행 일지 수정
  putDiary = async (diary_id, title, content, diary_img) => {
    const updatedDiary = await this.diaryRepository.putDiary(diary_id, title, content, diary_img);
    // 수정 권한 유효성 검사
    // if (true) {
    //   throw new CustomError(404, '에러 메세지 내용.');
    // }
  };

  // 여행 일지 삭제
  deleteDiary = async (diary_id) => {
    await this.diaryRepository.deleteDiary(diary_id);
    // 수정 권한 유효성 검사
    // if (true) {
    //   throw new CustomError(404, '에러 메세지 내용.');
    // }
  };
}

module.exports = DiaryService;
