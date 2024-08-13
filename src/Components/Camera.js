import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ort from 'onnxruntime-web';
import Navbar from './Navbar';
import axios from 'axios';
import '../assets/CSS/style.css';

const Camera = () => {
  const [loading, setLoading] = useState(false);
  const [fileSrc, setFileSrc] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const navigate = useNavigate();
  const [hasDetected, setHasDetected] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await ort.InferenceSession.create('public/TestFDA.onnx');
        console.log('ONNX Model loaded');
      } catch (error) {
        console.error('Error loading ONNX model:', error);
      }
    };

    loadModel();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          // 3초 후에 자동으로 촬영
          setTimeout(() => {
            detectObjects();  // 3초 후에 객체 감지 시작
          }, 3000);
        })
        .catch(err => {
          console.error('Error accessing webcam: ', err);
        });
    }
  }, []);

  const detectObjects = async () => {
    if (videoRef.current && modelRef.current && !hasDetected) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const inputTensor = new ort.Tensor('float32', new Float32Array(imageData.data.buffer), [1, 3, canvasRef.current.height, canvasRef.current.width]);

      try {
        const results = await modelRef.current.run({ input: inputTensor });
        const predictions = results.output.data;

        // 여기에 모델의 결과를 해석하는 코드를 추가합니다.
        if (predictions.length > 0) {
          setHasDetected(true);
          handleCapture(); // 사물이 감지되면 사진을 찍습니다.
        }
      } catch (error) {
        console.error('Error during inference:', error);
      }
    }
  };

  const handleCapture = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // 비디오 스트림을 정지합니다.
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());

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
        setHasDetected(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <Navbar />
      <div className="WebcamContainer">
        <video ref={videoRef} className="webcam" autoPlay muted playsInline />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

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
