import { FaCamera } from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {useState, uesEffect} from 'react'
import '../assets/CSS/style.css'
import Navbar from './Navbar';



const Home= () => {
    
    const navigate = useNavigate();
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [lastTap, setLastTap] = useState(0);

    const handleTouch = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
          navigate('/camera');
        }
    
        setLastTap(currentTime);
      };
    
    return (
        <div>
            <Navbar />
            <div className='HomeContainer' onClick={handleTouch}>
                <div className='HomeContent'>
                    <FaCamera className='CameraIcon'  />
                    <a className='text_1'>Touch<br />To<br /> Camera</a>
                    <a className='text_2'>화면을 두 번 터치하세요</a>
                </div>
            </div>
        </div>
    );
}

export default Home;