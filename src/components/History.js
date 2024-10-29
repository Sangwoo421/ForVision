import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import '../assets/History.css'


const History = () => {

    const navigate = useNavigate();

    const goback = () => {
        navigate(-1);
    }

    return (
        <div>
            <Header />
            <hr className="Line" />
            <img src="./Icon/arrow.png" className="Arrow_icon" onClick={goback} />
            <div className="HistoryContainer">
                <div className="HistoryContents">
                    <p className="History_text">내 기록</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default History;