import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/CSS/style.css'

const Camera = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileSrc, setFileSrc] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fileInputRef.current.click();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFileSrc(fileURL);

      const formData = new FormData();
      formData.append('file', selectedFile);

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
      }
    } else {
      console.log('No file selected');
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
      {loading && (
        <div className="loading">
          <img src="/images/logo.png" alt="Loading" />
        </div>
      )}
    </div>
  );
}

export default Camera;
