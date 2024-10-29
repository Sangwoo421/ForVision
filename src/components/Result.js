import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import Status from './Status';
import '../assets/Result.css'


const Result = () => {

    const location = useLocation();
    const { fileSrc } = location.state || {};

    // 상태 변수 정의
    const [foodName, setFoodName] = useState('');
    const [spoilage, setSpoilage] = useState('');
    const [ntrName, setntrName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/result'); // 데이터 요청
                if (response.data) {

                    setFoodName(response.data.foodNames || '');
                    setSpoilage(response.data.spoilNames || '');
                    setntrName(response.data.ntrNames || '');

                    speakText(`${response.data.foodNames || ''}, ${response.data.spoilNames || ''}, ${response.data.ntrNames || ''}`);
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

    const navigate = useNavigate();

    const goback = () => {
        navigate(-1);
    }

    return (
        <div>
            <Header />
            <div>
                <hr className="line" />
                <img src="/Icon/arrow.png" className="Arrow_icon" onClick={goback} />
            </div>
            <div className="Result_Container">
                {fileSrc && (
                    <img src={fileSrc} className='Result_img' alt="Captured" /> // 파일 소스가 있을 경우 이미지 표시
                )}
                <div className="Result_Contents">
                    <div className="Result_box">
                        <p className="Result_text">사진 분석 완료</p>
                        <div className='FoodName'>
                            {foodName} {/* 음식 이름 표시 */}
                        </div>
                        <div className='Spoilage'>
                            {spoilage} {/* 부패 상태 표시 */}
                        </div>
                        <div className='ntr'>
                            {ntrName} {/* 영양소 표시 */}
                        </div>
                        <Status spoilage={spoilage} /> {/* 상태 컴포넌트 */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Result;