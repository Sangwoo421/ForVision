const express = require('express'); // Express 모듈 불러오기
const path = require('path'); // 경로 처리를 위한 path 모듈 불러오기
const router = express.Router(); // Express의 Router 객체 생성

// 정적 파일 제공을 위한 미들웨어 설정
router.use(express.static(path.join(__dirname, '../front/build')));

// 모든 라우트를 React 앱으로 처리
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../front/build', 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err); // 오류가 발생하면 500 상태 코드와 오류 메시지 전송
    }
  });
});

module.exports = router; // 설정된 라우터 모듈 내보내기
