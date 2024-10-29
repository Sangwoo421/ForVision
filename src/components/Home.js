import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import '../assets/Home.css'

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
            navigate('/main'); // 카메라 페이지로 이동
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
            <Header />
            <div className="HomeContainer" onClick={handleTouch} onTouchStart={handleTouch}>
                <div className="HomeContents">
                    <p className="Home_text text1"><strong>FOR VISION</strong>에 오신 걸 환영합니다!</p>
                    <p className="Home_text text2">화면을 터치해주세요!</p>
                    <div className='ImgContainer'>
                        <div className='ImgContents'>
                        <img src='/1.png' className='HomeImg1 Img1' />
                        <img src='/2.jpg' className='HomeImg1 Img2' />
                        <img src='/3.jpg' className='HomeImg2 Img3' />
                        <img src='/4.jpg' className='HomeImg3 Img4' />
                        </div>
                    </div>
                    <img className="CameraIcon" src="/Icon/CameraIcon.png" alt="Camera Icon" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;