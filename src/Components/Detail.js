import React from 'react';
import Navbar from './Navbar';
import Apple from '../Img/64yA7ZGc1.jpg';
import '../assets/CSS/style.css';

const Detail = () => {
  return (
    <div className='DetailPage'>
      <Navbar />
      <div className="DetailContainer">
        <div className="DetailContent">
          <div className="ResultIMG">
            <img src={Apple} alt="Apple" className="AImg" />
          </div>
          
          <div className="Title"> <br /> 음식이름</div>
          <div className="Method">보관방법</div>
          <div className="Content">부패도</div>
          <div className="Explain">설명</div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
