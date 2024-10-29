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
    const [foodName, setFoodName] = useState([]);
    const [spoilage, setSpoilage] = useState([]);
    const [ntrName, setntrName] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/result'); // 데이터 요청
                if (response.data) {
                    setFoodName(response.data.foodNames || []);
                    setSpoilage(response.data.spoilNames || []);
                    setntrName(response.data.ntrName || {});

                    speakText(`${response.data.foodNames.join(', ')} 음식, ${response.data.spoilNames.join(', ')} 부패 상태`);
                }
            } catch (error) {
                console.error('Error fetching data from /result:', error);
            }
        };

        fetchData();
    }, []);

    // 텍스트를 음성으로 읽어주는 함수
    const speakText = (text) => {
        console.log('Speaking text:', text);
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
                <img src="/Icon/arrow.png" className="Arrow_icon" onClick={goback} alt="Go back" />
            </div>
            <div className="Result_Container">
                {fileSrc && (
                    <img src={fileSrc} className='Result_img' alt="Captured" />
                )}
                <div className="Result_Contents">
                    <div className="Result_box">
                        <p className="Result_text">사진 분석 완료</p>
                        <div className='FoodName'>
                            {foodName.join(', ')}
                        </div>
                        <div className='Spoilage'>
                            {spoilage.join(', ')}
                        </div>
                        <div className='ntr'>
                            {Object.keys(ntrName).map((food, index) => (
                                <div key={index}>
                                    <strong>{food}</strong>: 에너지 {ntrName[food].에너지}kcal, 단백질 {ntrName[food].단백질}g, 지방 {ntrName[food].지방}g, 탄수화물 {ntrName[food].탄수화물}g, 당류 {ntrName[food].당류}g, 나트륨 {ntrName[food].나트륨}mg
                                </div>
                            ))}
                        </div>
                        <Status spoilage={spoilage} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Result;
