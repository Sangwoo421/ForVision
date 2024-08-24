import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Camera from './Components/Camera';
import Detail from './Components/Detail';
import './assets/CSS/style.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본적으로 루트 경로에 Home 컴포넌트가 로드되도록 설정 */}
        <Route path="/" element={<Home />} />

        <Route path="/camera" element={<Camera />} />
        <Route path="/detail" element={<Detail />} />

        {/* 모든 잘못된 경로 접근을 Home으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
