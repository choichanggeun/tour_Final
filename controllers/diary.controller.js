const DiaryService = require('../services/diary.service');

class DiaryController {
  diaryService = new DiaryService();

  // 여행 일지 작성
  postDiary = async (req, res) => {
    try {
      const { tour_id } = req.params;
      const { title, content, diary_img } = req.body;

      await this.diaryService.postDiary(tour_id, title, content, diary_img);
      return res.status(200).json({ message: '여행 일지가 작성되었습니다.' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 조회
  getDiary = async (req, res) => {
    try {
      const { tour_id } = req.params;

      const data = await this.diaryService.getDiary(tour_id);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 수정
  putDiary = async (req, res) => {
    try {
      const { tour_id, diary_id } = req.params;
      const { title, content, diary_img } = req.body;

      await this.diaryService.putDiary(tour_id, diary_id, title, content, diary_img);
      return res.status(200).json({ message: '여행 일지가 수정되었습니다.' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };

  // 여행 일지 삭제
  deleteDiary = async (req, res) => {
    try {
      const { tour_id, diary_id } = req.params;

      await this.diaryService.deleteDiary(tour_id, diary_id);
      return res.status(200).json({ message: '여행 일지가 삭제되었습니다.' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
}

module.exports = DiaryController;
