import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const [fileSrc, setFileSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 페이지가 로드될 때 카메라를 자동으로 열기
    fileInputRef.current.click();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSrc(URL.createObjectURL(file));
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
