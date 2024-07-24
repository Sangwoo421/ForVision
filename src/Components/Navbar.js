import '../assets/CSS/style.css';

function Navbar() {
    return (
        <header className="NavbarContainer">
            <div className="NavbarContent">
                <a className="Logo" href="/">SNAPBITE</a>
                <a className="MenuIcon" href="#">&#9776;</a>
            </div>
        </header>
    );
}

export default Navbar;