import { useState } from 'react';
import Modal from './Modal';
import '../assets/Header.css'
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }

    const navigate = useNavigate();

    const ToHome = () => {

        navigate('/')
    }

    return (
        <div>
            <div className='HD_Container'>
                <div className='HD_Contents'>
                    <img className='Logo' src='/Logo.png' onClick={ToHome} />
                    <img className='bell_icon' src='/Icon/bell.png' onClick={toggleModal} />
                    {
                        modal === true ? <Modal /> : null
                    }
                </div>
            </div>
        </div>
    );
}

export default Header;