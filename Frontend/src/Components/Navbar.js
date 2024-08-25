import { useLocation } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../assets/CSS/style.css';

const Navbar = () => {

    const location = useLocation();

    const isDetailPage = location.pathname === '/detail';

    const [toggle, seToggle] = useState(false);

    const onIconClick = useCallback(() => {
        seToggle((P) => !P);
    })
    
    return (
    <header className={`NavbarContainer ${isDetailPage ? 'detail-page' : ''}`}>            
        <div className="NavbarContent">
            <a className="Logo" href='/'>FOR <br /> VISION</a>
            <FontAwesomeIcon className={`MenuIcon ${toggle ? 'open' : ''}`}
            icon={toggle ? faClose : faBars}
            onClick={onIconClick}
            />
            <nav className={`MenubarContainer ${toggle ? 'show' : ''}`}>
                <div className='MenubarTop'>

                </div>
                <ul className='MenybarContent'>
                    <li>
                        <span>로그인</span>
                    </li>
                    <li>
                        <span>회원가입</span>
                    </li>
                    <li>
                        <span>최근기록</span>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
    );
}

export default Navbar;