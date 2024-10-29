import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Option from './components/Option';
import History from './components/History';
import Mypage from './components/Mypage';
import Login from './components/Login';
import Result from './components/Result';
import Main from './components/Mains';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/main' element={<Main />} />
        <Route path='/option' element={<Option />} />
        <Route path='/history' element={<History />} />
        <Route path='mypage' element={<Mypage />} />
        <Route path='login' element={<Login />} />
        <Route path='/result' element={<Result />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
