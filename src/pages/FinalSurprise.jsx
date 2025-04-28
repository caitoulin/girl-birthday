import React, { useState, useEffect } from 'react';
import '../styles/finalSurprise.css';

const FinalSurprise = () => {
  const [step, setStep] = useState(0);
  const [envelope, setEnvelope] = useState(false);
  const [letter, setLetter] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  
  useEffect(() => {
    // 先显示背景，然后展示信封
    setTimeout(() => {
      setShowBackground(true);
      setTimeout(() => {
        setEnvelope(true);
      }, 1000);
    }, 500);
  }, []);
  
  const openEnvelope = () => {
    setLetter(true);
    // 打开信后显示内容
    setTimeout(() => {
      setShowMessage(true);
    }, 1500);
  };
  
  const message = `亲爱的，

当我提笔写下这封情书，我的心中满是对你的爱意和思念。

回想我们相遇的那一刻，仿佛命中注定。你的笑容如阳光般温暖，你的声音如微风般轻柔，每一次与你相处的时光都让我心动不已。

在我们共同走过的日子里，无论是欢笑还是泪水，都成为了我珍藏的回忆。你的理解、包容和支持，让我感到无比幸福和安心。

我想告诉你，你是我生命中最美好的存在。每当我看到你，我的世界便充满了色彩；每当我想起你，我的心便充满了温暖。

这封情书承载着我对你最深的爱意，希望我们的爱情能够如同美酒，历久弥香。

永远爱你的我
`;

  return (
    <div className="final-surprise-page">
      <div className={`love-letter-background ${showBackground ? 'show' : ''}`}>
        <div className="floating-hearts">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >♥</div>
          ))}
        </div>
      </div>
      
      <h1 className="final-title">我的情书</h1>
      
      <div className={`envelope-container ${envelope ? 'show' : ''}`}>
        <div className={`envelope ${letter ? 'open' : ''}`} onClick={!letter ? openEnvelope : undefined}>
          <div className="front flap"></div>
          <div className="front pocket"></div>
          <div className="letter" style={{transform: letter ? 'translateY(-100px)' : 'translateY(0)'}}>
            <div className="letter-content">
              {showMessage && (
                <div className="letter-text">
                  {message.split('\n').map((line, index) => (
                    <p key={index} style={{animationDelay: `${index * 0.5}s`}}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!letter && <p className="envelope-hint">点击打开情书</p>}
      </div>
      
      {showMessage && (
        <div className="final-message">
          <p>这些文字无法表达我对你全部的爱</p>
          <p>愿我们的爱情，长久如初</p>
          <div className="heart-animation">
            <div className="heart"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalSurprise;
