import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";

const Welcome = () => {
  useEffect(() => {
    const confettiEffect = () => {
      const confettiContainer = document.querySelector(".confetti-container");
      if (!confettiContainer) return;

      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confetti.style.backgroundColor = `hsl(${
          Math.random() * 360
        }, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
      }
    };

    confettiEffect();

    return () => {
      const confettiContainer = document.querySelector(".confetti-container");
      if (confettiContainer) {
        confettiContainer.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="welcome-page">
      <div className="confetti-container"></div>
      <div className="welcome-content">
        <h1 className="birthday-title">生日快乐！</h1>
        <div className="birthday-message">
          <p>
            亲爱的，小兔子宝宝老婆!在你特别的日子里，我们已经一起走过9个年头，我想用这种特别的方式来表达我对你的爱。
            这个页面是我用心为你准备的的在线生日礼物，里面装满了我们的回忆、我的祝福和一些惊喜。
            希望你会喜欢这份特别的礼物！
          </p>
          <p className="signature">爱你的大肥猫</p>
        </div>
        <div className="welcome-buttons">
          <Link to="/gallery" className="welcome-button">
            <i className="fas fa-images"></i> 查看照片墙
          </Link>
          <Link to="/memories" className="welcome-button">
            <i className="fas fa-heart"></i> 浏览回忆墙
          </Link>
          <Link to="/wishes" className="welcome-button">
            <i className="fas fa-birthday-cake"></i> 生日祝福
          </Link>
          <Link to="/timecapsule" className="welcome-button special">
            <i className="fas fa-hourglass-half"></i> 时间胶囊
          </Link>
          <Link to="/wishingstar" className="welcome-button star-wish-btn">
            <i className="fas fa-star"></i> 星空许愿
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
