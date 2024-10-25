import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Mypage = () => {

    const navigate = useNavigate();

    const goback = () => {
        navigate(-1);
    }

    return (

        <div>
            <Header />
            <div>
                <div>
                    <hr />
                    <img src="/Icon/Arrow.png" className="Arrow_icon" onClick={goback} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Mypage;