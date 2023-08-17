const DiaryService = require('../services/diary.service');

class DiaryController {
  diaryService = new DiaryService();

  postDiary = async (req, res) => {
    try {
      const { tour_id } = req.params;
      const { title, content, diary_img } = req.body;

      await this.diaryService.postDiary(tour_id, title, content, diary_img);
      return res.status(200).json({ message: '메세지 내용' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
  getDiary = async (req, res) => {
    try {
      const { tour_id } = req.params;

      await this.diaryService.getDiary(tour_id);
      return res.status(200).json({ message: '' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
  putDiary = async (req, res) => {
    try {
      const { tour_id, diary_id } = req.params;
      const { title, content, diary_img } = req.body;

      await this.diaryService.putDiary(tour_id, diary_id, title, content, diary_img);
      return res.status(200).json({ message: '' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
  deleteDiary = async (req, res) => {
    try {
      const { tour_id, diary_id } = req.params;

      await this.diaryService.deleteDiary(tour_id, diary_id);
      return res.status(200).json({ message: '' });
    } catch (error) {
      console.log(error.stack);
      return res.status(error.status || 500).send({ message: `${error.message}` });
    }
  };
}

module.exports = DiaryController;
