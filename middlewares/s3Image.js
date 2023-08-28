const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

class S3Image {
  storage = multerS3({
    s3: s3,
    bucket: 'final-tour-2/diary-img',
    key: function (req, file, cb) {
      cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
    },
  });

  imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  };

  limits = (req, file, cb) => {
    if (file.fileSize > 1024 * 1024) {
      return cb(new Error('파일 크기는 최대 1MB 입니다.'));
    }
    cb(null, true);
  };

  // 이미지 여러 개 업로드
  uploadImages = multer({ storage: this.storage, fileFilter: this.imageFilter, limits: this.limits }).array('image');

  // 이미지 하나 삭제
  deleteImage = async (fileName) => {
    const objectParams_del = {
      Bucket: 'final-tour-2',
      Key: `${fileName}`,
    };
    await s3
      .deleteObject(objectParams_del)
      .promise()
      .then(() => {
        console.log('이미지가 삭제되었습니다.');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 버켓 객체 리스트 출력 (폴더, 파일)
  getBucketLists = async () => {
    let objectlists = [];
    await s3
      .listObjectsV2({ Bucket: 'final-tour-2' })
      .promise()
      .then((data) => {
        console.log('Object Lists : ', data);
        for (let i of data.Contents) {
          objectlists.push(i.Key);
        }
        console.log('objectlists : ', objectlists);
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

module.exports = S3Image;
