const DiaryService = require('../services/diary.service');

class DiaryController {
  diaryService = new DiaryService();

  // 여행 일지 작성
  postDiary = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { title, content, status } = req.body;
      await this.diaryService.postDiary(user_id, tour_id, title, content, status);
      return res.status(201).json({ message: '여행 일지가 작성되었습니다.' });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 조회
  getDiary = async (req, res) => {
    try {
      const { diary_id } = req.params;

      const data = await this.diaryService.getDiary(diary_id);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 검색
  getDiary = async (req, res) => {
    try {
      const { diary_id } = req.params;

      const data = await this.diaryService.getDiary(diary_id);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 내 모든 여행 일지 조회
  getMyDiaries = async (req, res) => {
    try {
      const { id: user_id } = res.locals.user;
      const { diary_cursor } = req.query;
      const data = await this.diaryService.getMyDiaries(user_id, diary_cursor);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 계획 여행 일지 조회
  getTourDiaries = async (req, res) => {
    try {
      const { tour_id } = req.params;

      const data = await this.diaryService.getTourDiaries(tour_id);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 모든 여행 일지 조회 (공개 일지만)
  getDiaries = async (req, res) => {
    try {
      const { cursor } = req.query;
      const data = await this.diaryService.getDiaries(cursor);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 검색
  searchDiaries = async (req, res) => {
    try {
      const { cursor, search_data } = req.query;
      const data = await this.diaryService.searchDiaries(cursor, search_data);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 수정
  putDiary = async (req, res) => {
    try {
      const { diary_id } = req.params;
      const { title, content, status } = req.body;

      await this.diaryService.putDiary(diary_id, title, content, status);
      return res.status(200).json({ message: '여행 일지가 수정되었습니다.' });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 삭제
  deleteDiary = async (req, res) => {
    try {
      const { diary_id } = req.params;

      await this.diaryService.deleteDiary(diary_id);
      return res.status(200).json({ message: '여행 일지가 삭제되었습니다.' });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
}

module.exports = DiaryController;
