import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import * as ort from 'onnxruntime-web';
import '../assets/CSS/style.css';

const Camera = () => {
  // 상태 변수 정의
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [fileSrc, setFileSrc] = useState(null); // 캡처된 이미지 파일 소스
  const [modelLoaded, setModelLoaded] = useState(false); // 모델 로딩 상태
  const videoRef = useRef(null); // 비디오 요소 참조
  const canvasRef = useRef(null); // 캔버스 요소 참조
  const navigate = useNavigate(); // 네비게이션 훅
  const [session, setSession] = useState(null); // ONNX 세션 상태
  const [captured, setCaptured] = useState(false); // 이미지 캡처 상태

  // ONNX 모델을 비동기적으로 로딩
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("모델을 로딩 중...");
        const loadedSession = await ort.InferenceSession.create(process.env.PUBLIC_URL + '/realProtoTypeFDA.onnx');
        setSession(loadedSession);
        setModelLoaded(true);
        console.log("모델이 성공적으로 로딩되었습니다.");
      } catch (error) {
        console.error("ONNX 모델 로딩 실패:", error.message);
      }
    };
    loadModel();
  }, []);

  // 모델이 로드된 후 웹캠 접근 및 데이터 탐지 시작
  useEffect(() => {
    if (modelLoaded) {
      speakText("카메라가 켜졌습니다");
      console.log("카메라가 시작되었습니다.");

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment'
          }
        })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              console.log("비디오 스트림이 시작되었습니다.");

              const id = setInterval(() => {
                console.log("음식을 탐지 중...");
                detectFood(id); // 음식 탐지 함수 호출
              }, 1000);
            }
          })
          .catch(err => {
            console.error('웹캠 접근 오류:', err);
          });
      }
    }
  }, [modelLoaded]);

  // 음성 출력을 위한 함수
  const speakText = (text) => {
    const synth = window.speechSynthesis;

    // 현재 실행 중인 TTS를 취소
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    synth.speak(utterance);
    console.log(`음성 출력: ${text}`);
  };

  // 음식 탐지 및 캡처 처리
  const detectFood = async (intervalId) => {
    if (session && videoRef.current && canvasRef.current && !captured) {
      console.log("음식 탐지 프로세스를 시작합니다.");
      const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
      context.drawImage(videoRef.current, 0, 0, 640, 640);

      const imageData = context.getImageData(0, 0, 640, 640);
      console.log("처리를 위한 이미지 데이터를 캡처했습니다.");

      const imageTensor = preprocessImage(imageData);
      console.log("이미지 데이터를 텐서로 전처리했습니다.");

      try {
        const results = await session.run({ input: imageTensor });
        console.log("추론 실행 완료.");

        if (isFoodDetected(results.output.data)) {
          console.log("음식이 탐지되었습니다. 이미지를 캡처합니다...");
          setCaptured(true);
          clearInterval(intervalId);
          handleCapture(); // 이미지 캡처 및 업로드 처리 함수 호출
        } else {
          console.log("음식이 탐지되지 않았습니다.");
        }
      } catch (error) {
        console.error("추론 중 오류 발생:", error);
      }
    } else {
      console.log("세션, 비디오, 또는 캔버스가 아직 준비되지 않았습니다.");
    }
  };

  // 이미지를 텐서 형태로 전처리
  const preprocessImage = (imageData) => {
    const { data, width, height } = imageData;
    const rgbData = new Float32Array(width * height * 3);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      rgbData[j] = data[i] / 255.0;
      rgbData[j + 1] = data[i + 1] / 255.0;
      rgbData[j + 2] = data[i + 2] / 255.0;
    }

    console.log(`이미지를 텐서로 전처리: ${rgbData.length} 요소`);
    return new ort.Tensor('float32', rgbData, [1, 3, height, width]);
  };

  // 탐지 결과가 음식인지 판별
  const isFoodDetected = (outputData) => {
    const THRESHOLD = 0.8;
    return Array.from(outputData).some(value => value > THRESHOLD);
  };
  
  // 이미지 캡처 및 서버로 업로드
  const handleCapture = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 640);
    canvasRef.current.toBlob(async (blob) => {
      const fileURL = URL.createObjectURL(blob);
      setFileSrc(fileURL);
      console.log("이미지가 캡처되고 blob으로 저장되었습니다.");

      speakText("사진이 찍혔습니다. 잠시만 기다려주세요");

      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      setLoading(true);

      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("파일 업로드 성공:", response.data);
      } catch (error) {
        console.error('파일 업로드 오류:', error);
      } finally {
        // 웹캠 스트림 정지 및 상세 페이지로 네비게이션
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        setCaptured(true);
        console.log("캡처된 이미지로 상세 페이지로 이동합니다.");
        navigate('/detail', { state: { fileSrc: fileURL } });
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <Navbar />
      <div className="WebcamContainer">
        {!captured && (
          <video ref={videoRef} className="webcam" autoPlay muted playsInline />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="640" />

        {loading && (
          <div className="loading">
            <img src="/images/logo.png" alt="Loading" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Camera;
