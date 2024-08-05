import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Camera = () => {
  const [fileSrc, setFileSrc] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Camera component mounted');
    fileInputRef.current.click();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFileSrc(fileURL);
      console.log('File selected:', file);
      console.log('Navigating to /detail with state:', { fileSrc: fileURL });
      navigate('/detail', { state: { fileSrc: fileURL } });
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
        capture="camera"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {fileSrc && <img id="pic" src={fileSrc} alt="Selected" style={{ width: '100%' }} />}
    </div>
  );
}

export default Camera;
