import { useLocation } from 'react-router-dom';
import '../assets/CSS/style.css';

const Navbar = () => {

    const location = useLocation();

    const isDetailPage = location.pathname === '/detail';

    return (
<header className={`NavbarContainer ${isDetailPage ? 'detail-page' : ''}`}>            <div className="NavbarContent">
                <a className="Logo" href="/">SNAPBITE</a>
                <a className="MenuIcon" href="#">&#9776;</a>
            </div>
        </header>
    );
}

export default Navbar;