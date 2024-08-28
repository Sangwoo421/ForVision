import { useEffect, useState } from 'react';
import '../assets/CSS/style.css';

const Status = ({ spoilage }) => {
    const [statusClass, setStatusClass] = useState('StatusGreen');

    // TTS 음성 출력을 위한 함수
    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        synth.speak(utterance);
    };

    useEffect(() => {
        // spoilage의 타입을 확인하고, 문자열이 아닐 경우 빈 문자열로 처리
        console.log('Received spoilage:', spoilage); // 디버깅 로그
        const spoilageList = typeof spoilage === 'string' ? spoilage.split(' ') : [];
        let newStatusClass = 'StatusGreen';
        let message = '';

        if (spoilageList.includes('곰팡이') || spoilageList.includes('상함')) {
            newStatusClass = 'StatusRed';
            message = '먹으면 안되는 음식입니다.';
        } else if (spoilageList.includes('갈변') || spoilageList.includes('마름') || spoilageList.includes('변형')) {
            newStatusClass = 'StatusYellow';
            message = '먹는데 주의가 필요한 음식입니다. 변형이 된 부분을 제거하고 먹으세요.';
        } else {
            message = '이상이 없는 음식입니다. 먹으셔도 됩니다.';
        }

        setStatusClass(newStatusClass);
        speakText(message);
    }, [spoilage]);

    return (
        <div className='StatusContainer'>
            <div className='StatusContent'>
                <div className='StatusYellow'></div>
            </div>
        </div>
    );
};

export default Status;
