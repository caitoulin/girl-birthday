import React, { useState, useEffect, useCallback } from "react";
import { Fireworks, FireworkTypes } from "../components/FireWorks";
import "../styles/wishes.css";

const Wishes = () => {
  const [showCake, setShowCake] = useState(false);
  const [candlesLit, setCandlesLit] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showWishes, setShowWishes] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // 获取随机烟花类型的函数
  const getRandomFireworkType = (index) => {
    const types = [
      FireworkTypes.BURST,
      FireworkTypes.TRAIL,
      FireworkTypes.SPARKLE,
      FireworkTypes.HEART,
      FireworkTypes.STAR,
      FireworkTypes.SPIRAL,
    ];
    // 使用索引来确保同一个卡片总是获得相同的烟花类型
    return types[index % types.length];
  };

  useEffect(() => {
    // 防止页面初始化时的重定向问题
    const handleInitialLoad = () => {
      // 显示蛋糕动画
      const cakeTimer = setTimeout(() => {
        setShowCake(true);
      }, 500);

      // 点燃蜡烛动画
      const candleTimer = setTimeout(() => {
        setCandlesLit(true);
      }, 2000);

      return () => {
        clearTimeout(cakeTimer);
        clearTimeout(candleTimer);
      };
    };

    handleInitialLoad();
  }, []);

  const blowCandles = useCallback((e) => {
    // 阻止任何可能的默认事件
    if (e) e.preventDefault();

    setCandlesBlown(true);

    // 显示祝福语和五彩纸屑效果
    setTimeout(() => {
      setShowWishes(true);
      setConfetti(true);
    }, 1000);
  }, []);

  const wishes = [
    "祝你生日快乐，愿你的每一天都充满阳光和笑容！",
    "希望新的一年里，你的所有愿望都能实现！给你最幸福！",
    "愿你永远保持那份让我着迷的美丽与活力！好好爱我呢",
    "祝福你事业有成，梦想成真！宝宝永远是我心里最棒的宝宝！",
    "愿我们的爱情如美酒般，越陈越香！长长久久",
    "祝你健康、幸福，被爱包围的每一天！开心每一天",
  ];

  return (
    <div className="wishes-page" onClick={(e) => e.stopPropagation()}>
      <h1 className="wishes-title">生日咪祝福</h1>

      <div className={`cake-container ${showCake ? "show" : ""}`}>
        <div className="cake">
          <div className="cake-top"></div>
          <div className="cake-middle"></div>
          <div className="cake-bottom"></div>

          <div
            className={`candles ${candlesLit ? "lit" : ""} ${
              candlesBlown ? "blown" : ""
            }`}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="candle">
                <div className="flame"></div>
              </div>
            ))}
          </div>
        </div>

        {candlesLit && !candlesBlown && (
          <button
            className="blow-button"
            onClick={blowCandles}
            onTouchStart={(e) => {
              e.preventDefault();
              blowCandles(e);
            }}
          >
            吹灭蜡烛
          </button>
        )}
      </div>

      {showWishes && (
        <div className="wishes-container">
          {confetti && (
            <div className="confetti-explosion">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  }}
                ></div>
              ))}
            </div>
          )}
          <h2 className="make-wish">许个愿吧！</h2>
          <div className="wishes-list">
            {wishes.map((wish, index) => (
              <div
                key={index}
                className="wish-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="fireworks-container">
                  <Fireworks type={getRandomFireworkType(index)} />
                </div>
                <p>{wish}</p>
              </div>
            ))}
          </div>
          <div className="special-wish">
            <p>最重要的是，我希望你知道，你是我生命中最美好的礼物。</p>
            <p>我爱你，生日快乐！宝宝</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishes;
