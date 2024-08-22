import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import Status from './Status';
import '../assets/CSS/style.css';

const Detail = () => {

  const location = useLocation();
  const { fileSrc } = location.state || {};

  const [foodName, setFoodName] = useState('');
  const [spoilage, setSpoilage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/result');
        setFoodName(response.data.foodNames);
        setSpoilage(response.data.spoilNames);
        
        speakText(`${response.data.foodNames}, ${response.data.spoilNames}`);
      } catch (error) {
        console.error('Error fetching data from /result:', error);
      }
    };

    fetchData();
  }, []);

  const speakText = (text) => {
    const synth = window.speechSynthesis;
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
            <img src={fileSrc} className='Result' alt="Captured" />
          )}
          <div className='FoodName'>
            {foodName}
          </div>
          <div className='Spoilage'>
            상태:{spoilage}
          </div>
          <Status spoilage={spoilage} />
        </div>
      </div>
    </div>
  );
}

export default Detail;
