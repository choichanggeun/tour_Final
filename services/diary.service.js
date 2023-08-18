const DiaryRepository = require('../repositories/diary.repository');

class DiaryService {
  diaryRepository = new DiaryRepository();

  // 여행 일지 작성
  postDiary = async (tour_id, title, content, diary_img) => {
    await this.diaryRepository.postDiary(tour_id, title, content, diary_img);
  };

  // 여행 일지 조회
  getDiary = async (tour_id) => {
    return await this.diaryRepository.getDiary(tour_id);
    // if (true) {
    //   throw new CustomError(404, '에러 메세지 내용.');
    // }
  };

  // 여행 일지 수정
  putDiary = async (tour_id, diary_id, title, content, diary_img) => {
    await this.diaryRepository.putDiary(tour_id, diary_id, title, content, diary_img);
    // if (true) {
    //   throw new CustomError(404, '에러 메세지 내용.');
    // }
  };

  // 여행 일지 삭제
  deleteDiary = async (tour_id, diary_id) => {
    await this.diaryRepository.deleteDiary(tour_id, diary_id);
    // if (true) {
    //   throw new CustomError(404, '에러 메세지 내용.');
    // }
  };
}

module.exports = DiaryService;
