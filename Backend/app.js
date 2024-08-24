const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const fs = require('fs');
const https = require('https');

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 세션 설정
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// 라우터 설정
const uploadRouter = require('./routes/upload');
const resultRouter = require('./routes/result');
const indexRouter = require('./routes/index');

app.use('/upload', uploadRouter);
app.use('/result', resultRouter);
app.use('/', indexRouter);

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack); // 오류 스택 출력
  res.status(500).send('Internal Server Error'); // 500 상태 코드와 메시지 전송
});

// HTTPS 서버 설정
const port = process.env.PORT || 8080; // 포트를 환경 변수 또는 기본값 8080에서 가져옴
const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8'); // 인증서 키 파일 경로
const certificate = fs.readFileSync(path.join(__dirname, 'cert.crt'), 'utf8');   // 인증서 파일 경로
const credentials = { key: privateKey, cert: certificate };

// HTTPS 서버 시작
https.createServer(credentials, app).listen(port, () => {
  console.log(`HTTPS Server started on port ${port}`);
});
