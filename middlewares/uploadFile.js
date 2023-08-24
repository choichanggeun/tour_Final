const multer = require('multer');

// 이미지 받았을 때 필터링
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img-server');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

let limits = (req, file, cb) => {
  if (file.fileSize > 5 * 1024 * 1024) {
    return cb(new Error('파일 사이즈가 너무 큽니다.'));
  }
  cb(null, true);
};

let uploadFile = multer({ storage: storage, fileFilter: imageFilter, limits: limits }).single('image');

module.exports = uploadFile;
