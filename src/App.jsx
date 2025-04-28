import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Gallery from './pages/Gallery';
import MemoryWall from './pages/MemoryWall';
import Wishes from './pages/Wishes';
import Game from './pages/Game';
import TimeCapsulePage from './pages/TimeCapsulePage';
import WishingStar from './pages/WishingStar';
import Navigation from './components/Navigation';
import MusicPlayer from './components/MusicPlayer';
import './styles/app.css';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 确保只在初始加载时执行一次
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        navigate('/welcome');
        sessionStorage.setItem('hasVisited', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowIntro(false);
    }
  }, [navigate]);

  if (showIntro) {
    return (
      <div className="intro-screen">
        <div className="heart-container">
          <div className="heart"></div>
        </div>
        <h1 className="intro-text">亲爱的，这是我为你准备的生日惊喜...</h1>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation />
      <div className="content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/memories" element={<MemoryWall />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/game" element={<Game />} />
          <Route path="/timecapsule" element={<TimeCapsulePage />} />
          <Route path="/wishingstar" element={<WishingStar />} />
        </Routes>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default App;
