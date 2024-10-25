import Header from "./Header";
import Footer from "./Footer";
import '../assets/Home.css'

const Home = () => {

    return (

        <div>
            <Header />
            <div className="HomeContainer">
                <div className="HomeContents">
                    <div className="Image_Container">
                        {/* <img className="Image Image1" src="./Test.jpg"/> */}
                    </div>
                    <img className="CameraIcon" src="/Icon/CameraIcon.png" alt="Camera Icon" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;