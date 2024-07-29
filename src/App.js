import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar'
import Home from './Components/Home';
import Camera from './Components/Camera';
import Detail from './Components/Detail';
import './assets/CSS/style.css'
const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/camera' element={<Camera />} />
                <Route path='/detail' element={<Detail />}/>
            </Routes>
        </Router>

  );
}

export default App;
