import { FaCamera } from 'react-icons/fa';
import '../assets/CSS/style.css'

function Home(){
    return(
        <div className='HomeContainer'>
            <FaCamera className='CameraIcon' href="/Camera"/>
            <a className='text_1'>Touch<br />To<br /> Camera</a>
            <a className='text_2'>화면을 두 번 터치하세요</a>
        </div>
    );
}

export default Home;