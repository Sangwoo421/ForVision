import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/CSS/style.css';
import Navbar from './Navbar';

const Home = () => {
    const navigate = useNavigate(); // 페이지 네비게이션을 위한 훅
    const [lastTap, setLastTap] = useState(0); // 마지막 터치 시간 저장

    // 컴포넌트가 마운트될 때 음성 안내를 재생
    useEffect(() => {
        speakText('안녕하세요. 여러분의 ForVision입니다. 화면을 터치하여 시작하세요.');
    }, []);

    // 터치 이벤트 핸들러: 이중 터치 인식 및 페이지 이동 처리
    const handleTouch = (e) => {
        const currentTime = new Date().getTime(); // 현재 시간
        const tapLength = currentTime - lastTap; // 마지막 터치와 현재 터치 사이의 시간 차
        
        // 터치 간격이 500ms 이하일 경우 카메라 페이지로 이동
        if (tapLength < 500 && tapLength > 0) {
          navigate('/camera'); // 카메라 페이지로 이동
        }
    
        setLastTap(currentTime); // 마지막 터치 시간 업데이트
    };
    
    // 음성 출력 함수
    const speakText = (text) => {
        const synth = window.speechSynthesis;

        // 현재 실행 중인 TTS를 취소
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR'; // 한국어 설정
        synth.speak(utterance); // 음성 재생
    };
    
    return (
        <div>
            <Navbar /> {/* 내비게이션 바 표시 */}
            <div className='HomeContainer' onClick={handleTouch} onTouchStart={handleTouch}>
                <div className='HomeContent'>
                    <FaCamera className='CameraIcon' /> {/* 카메라 아이콘 표시 */}
                    <a className='text_1'>Touch<br />To<br /> Camera</a> {/* 영어 안내 문구 */}
                    <a className='text_2'>화면을 터치하세요</a> {/* 한국어 안내 문구 */}
                </div>
            </div>
        </div>
    );
}

export default Home;
