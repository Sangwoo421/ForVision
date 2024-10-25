import Header from "./Header";
import Footer from "./Footer";
import '../assets/History.css'
import { useNavigate } from "react-router-dom";

const History = () => {

    const navigate = useNavigate();

    const goback = () => {
        navigate(-1);
    }

    return(
        <div>
            <Header/>
            <div className="HistoryContainer">
                <div className="HistoryContents">
                    <hr className="Line"/>
                    <img src="./Icon/arrow.png" className="Arrow_icon" onClick={goback}/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default History;