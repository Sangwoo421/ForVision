import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import Navbar from './Navbar';

import '../assets/CSS/style.css';

const Camera = () => {
  const [loading, setLoading] = useState(false);
  const [fileSrc, setFileSrc] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const navigate = useNavigate();
  const [hasDetected, setHasDetected] = useState(false);  // 이미 감지되었는지 추적

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await cocoSsd.load();
      console.log('COCO-SSD Model loaded');
    };

    loadModel();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            detectObjects();  // 비디오가 준비된 후에 객체 감지를 시작합니다.
          };
        })
        .catch(err => {
          console.error('Error accessing webcam: ', err);
        });
    }
  }, []);

  const detectObjects = async () => {
    if (videoRef.current && modelRef.current && !hasDetected) {  // 이미 감지되었다면 더 이상 감지하지 않음
      const predictions = await modelRef.current.detect(videoRef.current);

      if (predictions.length > 0) {
        console.log('Objects detected:', predictions);

        // 특정 클래스만 감지
        const targetObjects = predictions.filter(prediction => 
          prediction.class === 'person' || prediction.class === 'apple' // 감지하고 싶은 클래스 지정
        );

        if (targetObjects.length > 0) {
          setHasDetected(true);  // 감지된 후 더 이상 감지하지 않도록 설정
          handleCapture();  // 사물이 감지되면 자동으로 촬영합니다.
        }
      }

      requestAnimationFrame(detectObjects);  // 계속해서 객체 감지를 수행합니다.
    }
  };

  const handleCapture = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(async (blob) => {
      const fileURL = URL.createObjectURL(blob);
      setFileSrc(fileURL);

      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      setLoading(true);

      try {
        await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File upload success');

        setTimeout(() => {
          navigate('/detail', { state: { fileSrc: fileURL } });
        }, 500);

      } catch (error) {
        console.error('File upload error:', error);
      } finally {
        setLoading(false);
        setHasDetected(false);  // 촬영이 완료되면 다시 감지할 수 있도록 초기화
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <Navbar />
      <div className="WebcamContainer">
        <video ref={videoRef} className="webcam" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <button onClick={handleCapture} className="captureButton">촬영</button>

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
