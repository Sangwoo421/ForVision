import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/CSS/style.css';

const Detail = () => {
  const location = useLocation();
  const { state } = location;
  const [foodNames, setFoodNames] = useState([]);
  const [spoilNames, setSpoilNames] = useState([]);

  useEffect(() => {
    console.log('Detail component received state:', state);

    if (state && state.fileSrc) {
      const fetchData = async () => {
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

          await axios.post('/result', result.data);

          console.log('받은 음식 이름들:', result.data.foodNames);
          console.log('받은 상함 상태들:', result.data.spoilNames);

          setFoodNames(result.data.foodNames);
          setSpoilNames(result.data.spoilNames);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
        }
      };

      fetchData();
    }
  }, [state]);

  useEffect(() => {
    const fetchResult = async () => {
      console.log('GET /result 엔드포인트 호출');
      try {
        const response = await axios.get('/result');
        console.log('프론트엔드로 받은 데이터:', response.data);
        setFoodNames(response.data.foodNames);
        setSpoilNames(response.data.spoilNames);
      } catch (error) {
        console.error('결과를 가져오는 중 오류 발생:', error);
      }
    };

    fetchResult();
  }, []);

  return (
    <div className='DetailPage'>
      <Navbar />
      <div className="DetailContainer">
        <div className="DetailContent">
          <div className="ResultIMG">
            {state && state.fileSrc && (
              <img src={state.fileSrc} alt="Captured" className="AImg" />
            )}
             {/* <img src="/images/apple.jpg" alt="Loading" className='AImg'/> */}
          </div>

          <div className="Title">음식:</div>
          <ul>
            {foodNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <div className="Title">부패도:</div>
          <ul>
            {spoilNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
            <li>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Detail;
