import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Camera = () => {
  const [fileSrc, setFileSrc] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserGesture = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    // 사용자의 상호작용을 기다림
    document.addEventListener('click', handleUserGesture, { once: true });

    return () => {
      document.removeEventListener('click', handleUserGesture);
    };
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFileSrc(fileURL);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8080/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('파일 업로드 성공:', response.data);

        navigate('/detail', { state: { fileSrc: fileURL, uploadedData: response.data } });
      } catch (error) {
        console.error('파일 업로드 실패:', error);
      }
    }
  };

  return (
    <div className="WebcamContainer">
      <input
        type="file"
        id="camera"
        name="camera"
        capture="environment"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      {fileSrc && <img id="pic" src={fileSrc} alt="Selected" style={{ width: '100%' }} />}
      {!fileSrc && <p>카메라를 열려면 화면을 터치하세요</p>}
    </div>
  );
};

export default Camera;
