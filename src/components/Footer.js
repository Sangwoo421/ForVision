import '../assets/Footer.css'

const Footer = () => {

    return(

        <div>
            <div className='FT_Container'>
                <div className='FT_Contents'>
                    <img className='option_btn' src='/Icon/option.png'/> 
                    <img className='history_btn' src='/Icon/history.png'/>
                    <img className='home_btn' src='/Icon/home.png'/>
                    <img className='my_btn' src='/Icon/my.png'/>
                    <img className='logout_btn' src='/Icon/logout.png'/>
                </div>
            </div>
        </div>
    );
}

export default Footer;