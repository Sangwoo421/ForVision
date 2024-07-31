const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('./db');
const User = require('./models/user');
const Image = require('./models/image');

const app = express();
app.use(express.json());

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join(uploadDir, req.user.username);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 로그인 미들웨어 (예시)
app.use(async (req, res, next) => {
  // 실제로는 토큰 또는 세션을 사용하여 사용자 인증을 해야 합니다.
  const user = await User.findOne({ where: { username: 'testuser' } });
  if (!user) {
    return res.status(401).send('User not found');
  }
  req.user = user;
  next();
});

// 파일 업로드 엔드포인트
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = path.join(req.user.username, req.file.filename);
    const newImage = await Image.create({
      filename: req.file.filename,
      path: imagePath,
      UserId: req.user.id
    });
    res.send('File uploaded successfully: ' + req.file.filename);
  } catch (error) {
    res.status(500).send('Error uploading file: ' + error.message);
  }
});

// 서버 시작
const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
