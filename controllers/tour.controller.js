const TourService = require('../services/tour.service');
const io = require('../utils/io').getIO();

class TourController {
  tourService = new TourService();

  //여행 계획 등록
  postTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_site_id } = req.params;
      const { title, start_date, end_date } = req.body;
      const { result, code, message } = await this.tourService.createTour({
        user_id,
        title,
        start_date,
        end_date,
        tour_site_id,
      });
      // 새로운 여행 계획 생성 후 해당 '방'의 모든 클라이언트에게 알림
      io.to(tour_site_id).emit('tour created', result);
      return res.status(code).json({ result, code, message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ result: err.result, code: err.code, message: err.message });
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };
  // 단일 여행 계획 조회 (tour_id)
  getTourOne = async (req, res, next) => {
    try {
      const { tour_id } = req.params;
      const { code, message, result } = await this.tourService.getTourOne(tour_id);
      return res.status(code).json({ message, result });
    } catch (error) {
      console.log(error);
      return res.status(error.code).json({ message: error.message });
    }
  };
  // 모든 여행 계획 조회
  getTourList = async (req, res, next) => {
    try {
      const { code, message, result } = await this.tourService.getTourList();
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 좋아요 순으로 여행 계획 조회
  getLikeList = async (req, res, next) => {
    try {
      const { code, message, result } = await this.tourService.getLikeList();
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  searchTour = async (req, res, next) => {
    try {
      const { search_data, search_type } = req.params;
      const { code, message, result } = await this.tourService.searchTour(search_data, search_type);
      return res.status(code).json({ message, result });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      console.log(error);
      return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
    }
  };

  // 로그인한 유저의 여행 계획 조회
  getTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { data, code, message } = await this.tourService.getTourData({ user_id });
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };
  // 여행 계획 수정
  putTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { title, start_date, end_date } = req.body;
      const { code, message } = await this.tourService.putTour(user_id, tour_id, title, start_date, end_date);

      return res.status(code).json({ message, code });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };
  // 여행 계획 삭제
  deleteTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { code, message } = await this.tourService.deleteTour({
        user_id,
        tour_id,
      });
      return res.status(code).json({ message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { code, message } = await this.tourService.updateStatus(user_id, tour_id);
      return res.status(code).json({ code, message });
    } catch (err) {
      console.error(err);
      res.status(500).send('알 수 없는 에러가 발생');
    }
  };

  getVerifyTour = async (req, res, next) => {
    try {
      const { id: user_id } = res.locals.user;
      const { tour_id } = req.params;
      const { data, code, message } = await this.tourService.getVerifyTour(user_id, tour_id);
      return res.status(code).json({ message, data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
    }
  };

  // // 임시 여행 계획 작성
  // postTempTour = async (req, res, next) => {
  //   try {
  //     const { id: user_id } = res.locals.user;
  //     const { tour_site_id } = req.params;
  //     const { title, start_date, end_date, invites, status } = req.body;

  //     try {
  //       const tour = await this.tourService.createTempTour({
  //         tour_site_id,
  //         user_id,
  //         title,
  //         start_date,
  //         end_date,
  //         status,
  //       });
  //     } catch (err) {
  //       console.error('투어 생성 중 오류 발생', err);
  //       throw err; // Re-throw the error to be caught by the outer catch block
  //     }

  //     console.log(req.body);

  //     if (invites) {
  //       for (let email of invites) {
  //         await inviteController.inviteEmail({
  //           locals: { user: { id: user_id } },
  //           params: { tour_id: tour.id },
  //           body: { inviteEmail: email },
  //         });
  //         console.log(`초대 이메일 전송 완료: ${email}`);
  //       }
  //     }

  //     return res.status(201).json({ message: ' 사용자 초대가 완료되었습니다.' });
  //   } catch (err) {
  //     if (err.code) return res.status(err.code).json({ message: err.message });
  //     console.error(err); // Log the error for debugging purposes.
  //     return res.status(500).json({ message: 'Internal server error' }); // Return a generic error message.
  //   }
  // };
}

module.exports = TourController;
