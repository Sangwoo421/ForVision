import { useNavigate } from 'react-router-dom';
import '../assets/Footer.css'

const Footer = () => {

    const navigate = useNavigate();

    const ToHome = () => {

        navigate('/')
    }

    const ToOption = () => {

        navigate('/option')
    }

    const ToHistory = () => {

        navigate('/history')
    }

    const ToMypage = () => {

        navigate('/mypage')
    }

    const ToLogin = () => {

        navigate('/login')
    }

    return (

        <div>
            <div className='FT_Container'>
                <div className='FT_Contents'>
                    <img className='option_btn' src='/Icon/option.png' onClick={ToOption} />
                    <img className='history_btn' src='/Icon/history.png' onClick={ToHistory} />
                    <img className='home_btn' src='/Icon/home.png' onClick={ToHome} />
                    <img className='my_btn' src='/Icon/my.png' onClick={ToMypage} />
                    <img className='logout_btn' src='/Icon/logout.png' onClick={ToLogin} />
                </div>
            </div>
        </div>
    );
}

export default Footer;