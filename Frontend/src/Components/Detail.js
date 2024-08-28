import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import Status from './Status';
import '../assets/CSS/style.css';

const Detail = () => {
  const location = useLocation();
  const { fileSrc } = location.state || {}; // 위치 상태에서 fileSrc를 추출

  // 상태 변수 정의
  const [foodName, setFoodName] = useState(''); // 음식 이름 상태
  const [spoilage, setSpoilage] = useState(''); // 부패 상태

  // 컴포넌트가 마운트될 때 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/result'); // 데이터 요청
        if (response.data) {
          // 응답 데이터가 있으면 상태 업데이트
          setFoodName(response.data.foodNames || '');
          setSpoilage(response.data.spoilNames || '');
          // 상태 값 변경 시 텍스트를 음성으로 읽어줍니다.
          speakText(`${response.data.foodNames || ''}, ${response.data.spoilNames || ''}`);
        }
      } catch (error) {
        console.error('Error fetching data from /result:', error);
      } 
    };

    fetchData();
  }, []);

  // 텍스트를 음성으로 읽어주는 함수
  const speakText = (text) => {
    console.log('Speaking text:', text); // 디버깅 로그 추가
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; 
    synth.speak(utterance);
  };

  return (
    <div>
      <Navbar />
      <div className='DetailContainer'>
        <div className='DetailContent'>
          {fileSrc && (
            <img src={fileSrc} className='Result' alt="Captured" /> // 파일 소스가 있을 경우 이미지 표시
          )}
          <div className='FoodName'>
            {foodName} {/* 음식 이름 표시 */}
          </div>
          <div className='Spoilage'>
            상태: {spoilage} {/* 부패 상태 표시 */}
          </div>
          <Status spoilage={spoilage} /> {/* 상태 컴포넌트 */}
        </div>
      </div>
    </div>
  );
}

export default Detail;
