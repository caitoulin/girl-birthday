import React, { useState, useEffect } from 'react';
import '../styles/timeCapsule.css';

const TimeCapsule = ({ unlockDate, messages, images, onUnlock }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState('');
  
  // 检查是否可以解锁
  useEffect(() => {
    const checkUnlockStatus = () => {
      const now = new Date();
      const targetDate = new Date(unlockDate);
      
      if (now >= targetDate) {
        setIsUnlocked(true);
        setTimeRemaining(null);
      } else {
        setIsUnlocked(false);
        
        // 计算剩余时间
        const timeDiff = targetDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };
    
    checkUnlockStatus();
    const interval = setInterval(checkUnlockStatus, 1000); // 每秒更新一次
    
    return () => clearInterval(interval);
  }, [unlockDate]);
  
  // 处理打开胶囊
  const handleOpen = () => {
    if (isUnlocked) {
      setAnimation('opening');
      setTimeout(() => {
        setShowContent(true);
        if (onUnlock) onUnlock();
      }, 1500);
    }
  };
  
  // 导航到下一条消息
  const nextMessage = () => {
    if (currentIndex < messages.length - 1) {
      setAnimation('slide-out');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimation('slide-in');
      }, 500);
    }
  };
  
  // 导航到上一条消息
  const prevMessage = () => {
    if (currentIndex > 0) {
      setAnimation('slide-out-reverse');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimation('slide-in-reverse');
      }, 500);
    }
  };
  
  return (
    <div className="time-capsule-container">
      <h2 className="capsule-title">时间胶囊</h2>
      <p className="capsule-subtitle">一个特别的惊喜，只在特定的时刻揭晓</p>
      
      {!showContent ? (
        <div className={`capsule-wrapper ${isUnlocked ? 'unlocked' : ''} ${animation}`}>
          <div className="capsule">
            <div className="capsule-lid"></div>
            <div className="capsule-body"></div>
            
            <div className="capsule-status">
              {isUnlocked ? (
                <button className="unlock-button" onClick={handleOpen}>
                  <i className="fas fa-unlock"></i> 打开时间胶囊
                </button>
              ) : (
                <div className="lock-info">
                  <i className="fas fa-lock"></i>
                  <div className="countdown">
                    <p>距离解锁还有</p>
                    <div className="countdown-timer">
                      <div className="countdown-item">
                        <span className="countdown-value">{timeRemaining?.days}</span>
                        <span className="countdown-label">天</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-value">{timeRemaining?.hours}</span>
                        <span className="countdown-label">时</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-value">{timeRemaining?.minutes}</span>
                        <span className="countdown-label">分</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-value">{timeRemaining?.seconds}</span>
                        <span className="countdown-label">秒</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="capsule-content">
          <div className={`content-slide ${animation}`}>
            {images && images[currentIndex] && (
              <div className="content-image">
                <img src={images[currentIndex]} alt={`胶囊图片 ${currentIndex + 1}`} />
              </div>
            )}
            
            <div className="content-message">
              {messages[currentIndex].split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            
            {messages.length > 1 && (
              <div className="content-navigation">
                <button 
                  className="nav-button prev" 
                  onClick={prevMessage}
                  disabled={currentIndex === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="nav-indicator">{currentIndex + 1} / {messages.length}</span>
                <button 
                  className="nav-button next" 
                  onClick={nextMessage}
                  disabled={currentIndex === messages.length - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeCapsule;
