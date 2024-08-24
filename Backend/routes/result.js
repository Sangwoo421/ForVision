const express = require('express');
const router = express.Router();

let processedResult = null; // 전역 변수로 결과 저장

// AI 서버에서 결과를 직접 받는 라우트
router.post('/', (req, res) => {
  processedResult = req.body;
  console.log('AI 서버에서 처리된 결과 수신:', processedResult);
  res.send('Processed result saved');
});

router.get('/', (req, res) => {
  console.log('GET /result 호출됨');
  console.log('프론트엔드로 보내는 데이터:', processedResult);
  if (processedResult) {
    res.json(processedResult);
  } else {
    res.status(404).send('No processed result available');
  }
});

module.exports = router;


