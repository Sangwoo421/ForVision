import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import * as ort from 'onnxruntime-web';
import '../assets/CSS/style.css';

const Camera = () => {
  const [loading, setLoading] = useState(false);
  const [fileSrc, setFileSrc] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedSession = await ort.InferenceSession.create(process.env.PUBLIC_URL + '/TestFDA.onnx');
        setSession(loadedSession);
        setModelLoaded(true);
      } catch (error) {
        console.error("Failed to load the ONNX model:", error.message);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (modelLoaded) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(stream => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();

            const id = setInterval(() => {
              detectFood(id);
            }, 1000);
          })
          .catch(err => {
            console.error('Error accessing webcam:', err);
          });
      }
    }
  }, [modelLoaded]);

  const detectFood = async (intervalId) => {
    if (session && videoRef.current && canvasRef.current && !captured) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 640);

      const imageData = context.getImageData(0, 0, 640, 640);
      const imageTensor = preprocessImage(imageData);

      try {
        const results = await session.run({ input: imageTensor });

        if (isFoodDetected(results.output.data)) {
          setCaptured(true);
          clearInterval(intervalId);
          handleCapture();
        }
      } catch (error) {
        console.error("Error during inference:", error);
      }
    }
  };

  const preprocessImage = (imageData) => {
    const { data, width, height } = imageData;
    const rgbData = new Float32Array(width * height * 3);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      rgbData[j] = data[i] / 255.0;
      rgbData[j + 1] = data[i + 1] / 255.0;
      rgbData[j + 2] = data[i + 2] / 255.0;
    }

    return new ort.Tensor('float32', rgbData, [1, 3, height, width]);
  };

  const isFoodDetected = (outputData) => {
    const THRESHOLD = 0.5;
    return Array.from(outputData).some(value => value > THRESHOLD);
  };

  const handleCapture = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 640);
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

        setTimeout(() => {
          navigate('/detail', { state: { fileSrc: fileURL } });
        }, 500);

      } catch (error) {
        console.error('File upload error:', error);
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <Navbar />
      <div className="WebcamContainer">
        <video ref={videoRef} className="webcam" autoPlay muted playsInline />
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
