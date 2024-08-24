import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/CSS/style.css';
import Navbar from './Navbar';

const Home = () => {
    
    const navigate = useNavigate();
    const [lastTap, setLastTap] = useState(0);

    // 앱에 들어오자마자 TTS로 정보를 안내하는 기능
    useEffect(() => {
        speakText('안녕하세요. 여러분의 ForVision입니다. 화면을 터치하여 시작하세요.');
    }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행되도록 함

    const handleTouch = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
          navigate('/camera');
        }
    
        setLastTap(currentTime);
    };
    
    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        synth.speak(utterance);
    };
    
    return (
        <div>
            <Navbar />
            <div className='HomeContainer' onClick={handleTouch} onTouchStart={handleTouch}>
                <div className='HomeContent'>
                    <FaCamera className='CameraIcon'  />
                    <a className='text_1'>Touch<br />To<br /> Camera</a>
                    <a className='text_2'>화면을 터치하세요</a>
                </div>
            </div>
        </div>
    );
}

export default Home;
