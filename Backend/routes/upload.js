const express = require('express'); // Express 모듈 불러오기
const multer = require('multer'); // Multer 모듈 불러오기 (파일 업로드를 위해 사용)
const path = require('path'); // 경로 처리를 위한 path 모듈 불러오기
const fs = require('fs'); // 파일 시스템 모듈 불러오기
const axios = require('axios'); // HTTP 요청을 위한 Axios 모듈 불러오기
const FormData = require('form-data'); // FormData 모듈 불러오기 (파일 업로드를 위해 사용)

const router = express.Router(); // Express의 Router 객체 생성

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // 디렉토리가 존재하지 않으면 생성
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadDir, 'anonymous');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir); // 사용자 디렉토리가 존재하지 않으면 생성
    }
    cb(null, userDir); // 업로드 디렉토리 설정
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정 (현재 시간 + 확장자)
  }
});

const upload = multer({ storage: storage }); // Multer 미들웨어 설정

// 파일 업로드 라우터
router.post('/', upload.single('file'), async (req, res) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(req.file.path)); // 파일을 FormData에 추가

  try {
    // FastAPI 서버로 파일 전송
    await axios.post('http://220.69.241.62:8082/upload', form, {
      headers: form.getHeaders()
    });
    
    res.status(200).send('Image successfully uploaded to AI server'); // 성공 메시지 전송
  } catch (error) {
    console.error('AI 서버로 이미지 업로드 중 오류 발생:', error); // 디버깅 로그 추가
    res.status(500).send('Error uploading image to AI server'); // 오류 발생 시 클라이언트에 메시지 전송
  }
});

module.exports = router; // 라우터 모듈 내보내기
