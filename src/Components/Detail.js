import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/CSS/style.css';

const Detail = () => {
  const location = useLocation();
  const { state } = location;
  const {foodName,setFoodName} = useState('');

  useEffect(() => {
    if (state && state.fileSrc) {
      const sendImageToBackend = async () => {
        try {

          const response = await fetch(state.fileSrc);
          const blob = await response.blob();
          
          const formData = new FormData();
          formData.append('file', blob, 'image.jpg');

          const result = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log('이미지 업로드 성공:', result.data);
          setFoodName(result.data.foodName);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
        }
      };

      sendImageToBackend();
    }
  }, [state]);

  console.log('Detail component received state:', state);

  return (
    <div className='DetailPage'>
      <Navbar />
      <div className="DetailContainer">
        <div className="DetailContent">
          <div className="ResultIMG">
            {state && state.fileSrc && (
              <img src={state.fileSrc} alt="Captured" className="AImg" />
            )}
          </div>

          <div className="Title"> { foodName }</div>
          {/* <div className="Method">보관방법</div>
          <div className="Content">부패도</div>
          <div className="Explain">설명</div> */}
        </div>
      </div>
    </div>
  );
}

export default Detail;
