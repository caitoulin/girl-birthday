import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/wishingStar.css';

const WishingStar = () => {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState(() => {
    const savedWishes = localStorage.getItem('starWishes');
    return savedWishes ? JSON.parse(savedWishes) : [];
  });
  const [isWishing, setIsWishing] = useState(false);
  const [shootingStar, setShootingStar] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentWishIndex, setCurrentWishIndex] = useState(-1);
  const canvasRef = useRef(null);
  
  const [shareMode, setShareMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  
  // 检查URL中是否包含分享的愿望ID
  useEffect(() => {
    const queryParams = new URLSearchParams(location.hash.split('?')[1] || '');
    const sharedWishId = queryParams.get('wish');
    
    if (sharedWishId) {
      const wishIndex = wishes.findIndex(w => w.id === parseInt(sharedWishId));
      if (wishIndex !== -1) {
        setShowIntro(false);
        setTimeout(() => {
          setCurrentWishIndex(wishIndex);
        }, 1000);
      }
    }
  }, [location, wishes]);

  // 初始化星空
  useEffect(() => {
    if (!showIntro && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // 设置canvas尺寸为窗口大小
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawStars();
      };
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      // 创建星星
      function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0c1445');
        gradient.addColorStop(1, '#1a237e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制星星
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 1.5;
          const opacity = Math.random();
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
        
        // 绘制更大的亮星
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 1 + Math.random() * 2;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          
          // 创建径向渐变
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
      
      // 每隔一段时间重绘星星，使其闪烁
      const interval = setInterval(() => {
        drawStars();
      }, 3000);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        clearInterval(interval);
      };
    }
  }, [showIntro]);
  
  // 保存愿望到本地存储
  useEffect(() => {
    if (wishes.length > 0) {
      localStorage.setItem('starWishes', JSON.stringify(wishes));
    }
  }, [wishes]);
  
  // 开始许愿流程
  const startWishing = () => {
    setIsWishing(true);
  };
  
  // 提交愿望
  const submitWish = (e) => {
    e.preventDefault();
    
    if (wish.trim() === '') return;
    
    // 创建流星效果
    setShootingStar(true);
    
    // 流星动画结束后保存愿望
    setTimeout(() => {
      setShootingStar(false);
      const newWish = {
        id: Date.now(),
        text: wish,
        date: new Date().toLocaleDateString(),
        fulfilled: false,
        shared: false
      };
      
      setWishes([...wishes, newWish]);
      setWish('');
      setIsWishing(false);
      setShowConfirmation(true);
      
      // 3秒后隐藏确认信息
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }, 2000);
  };
  
  // 分享愿望到手机号
  const shareWish = (wishId) => {
    const wishToShare = wishes.find(w => w.id === wishId);
    if (!wishToShare) return;
    
    setCurrentWishIndex(wishes.findIndex(w => w.id === wishId));
    setShareMode(true);
  };
  
  // 发送短信分享愿望
  const sendSmsShare = () => {
    if (!phoneNumber || !phoneNumber.match(/^1[3-9]\d{9}$/)) {
      setShareStatus('请输入有效的手机号码');
      return;
    }
    
    // 生成短信内容
    const smsBody = `我在星空许愿中许下了一个愿望：${wishes[currentWishIndex].text}`;
    
    // 尝试打开短信应用
    try {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`;
      
      // 更新愿望状态为已分享
      setWishes(wishes.map(w => 
        w.id === wishes[currentWishIndex].id 
          ? { ...w, shared: true } 
          : w
      ));
      
      setShareStatus('短信应用已打开');
      
      // 3秒后关闭分享模式
      setTimeout(() => {
        setShareMode(false);
        setShareStatus('');
        setPhoneNumber('');
      }, 3000);
    } catch (err) {
      setShareStatus('打开短信应用失败');
      console.log('分享失败:', err);
    }
  };
  
  // 查看愿望详情
  const viewWish = (index) => {
    setCurrentWishIndex(index);
  };
  
  // 关闭愿望详情
  const closeWishDetail = () => {
    setCurrentWishIndex(-1);
  };
  
  // 标记愿望为已实现
  const markAsFulfilled = (id) => {
    setWishes(wishes.map(wish => 
      wish.id === id ? { ...wish, fulfilled: !wish.fulfilled } : wish
    ));
    setCurrentWishIndex(-1);
  };
  
  // 删除愿望
  const deleteWish = (id) => {
    setWishes(wishes.filter(wish => wish.id !== id));
    setCurrentWishIndex(-1);
  };
  
  // 取消分享
  const cancelShare = () => {
    setShareMode(false);
    setShareStatus('');
    setPhoneNumber('');
  };
  
  return (
    <div className="wishing-star-page">
      {showIntro ? (
        <div className="intro-container">
          <h1 className="intro-title">星空许愿</h1>
          <div className="intro-content">
            <p>在这片星空下，每颗星星都承载着一个愿望。</p>
            <p>当你对着流星许下心愿，它将被宇宙记录，并在某天实现。</p>
            <p>无论是对爱情的期许，对未来的憧憬，还是对生活的美好愿景...</p>
            <p>都可以在这里留下，成为我们共同的回忆。</p>
          </div>
          <button 
            className="enter-button"
            onClick={() => setShowIntro(false)}
          >
            进入星空
          </button>
        </div>
      ) : (
        <div className="starry-sky">
          <canvas ref={canvasRef} className="stars-canvas"></canvas>
          
          {!isWishing && !showConfirmation && currentWishIndex === -1 && !shareMode && (
            <div className="sky-controls">
              <h2 className="sky-title">我们的星空</h2>
              <p className="sky-subtitle">每颗星星都是一个愿望，闪烁着希望的光芒,记得点击星星分享愿望哟！</p>
              
              <div className="control-buttons">
                <button className="wish-button" onClick={startWishing}>
                  <i className="fas fa-star"></i> 许下新愿望
                </button>
                
                {wishes.length > 0 && (
                  <div className="wishes-container">
                    <h3 className="wishes-title">我们的愿望 ({wishes.length})</h3>
                    <div className="wishes-list">
                      {wishes.map((wish, index) => (
                        <div 
                          key={wish.id} 
                          className={`wish-star ${wish.fulfilled ? 'fulfilled' : ''}`}
                          onClick={() => viewWish(index)}
                          style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            animationDelay: `${Math.random() * 5}s`
                          }}
                        >
                          <div className="star-icon">★</div>
                          <div className="star-tooltip">{wish.text.substring(0, 15)}...</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isWishing && (
            <div className="wish-form-container">
              <div className="wish-form">
                <h3>对着流星许愿</h3>
                <p>写下你的心愿，等待流星带去远方</p>
                
                <form onSubmit={submitWish}>
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="我希望..."
                    rows="4"
                    maxLength="200"
                  ></textarea>
                  
                  <div className="form-actions">
                    <button type="button" onClick={() => setIsWishing(false)}>取消</button>
                    <button type="submit">许愿</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {shootingStar && (
            <div className="shooting-star">
              <div className="star"></div>
              <div className="star-tail"></div>
            </div>
          )}
          
          {showConfirmation && (
            <div className="wish-confirmation">
              <div className="confirmation-content">
                <i className="fas fa-check-circle"></i>
                <h3>你的愿望已被星空记录</h3>
                <p>愿它在不久的将来成真</p>
              </div>
            </div>
          )}
          
          {currentWishIndex !== -1 && !shareMode && (
            <div className="wish-detail">
              <div className="detail-content">
                <div className="detail-header">
                  <h3>{wishes[currentWishIndex].fulfilled ? '已实现的愿望' : '等待实现的愿望'}</h3>
                  <button className="close-button" onClick={closeWishDetail}>×</button>
                </div>
                
                <div className="detail-body">
                  <p className="wish-text">{wishes[currentWishIndex].text}</p>
                  <p className="wish-date">许愿日期: {wishes[currentWishIndex].date}</p>
                  {wishes[currentWishIndex].shared && (
                    <p className="wish-shared"><i className="fas fa-share-alt"></i> 已分享</p>
                  )}
                </div>
                
                <div className="detail-actions">
                  <button 
                    className="fulfill-button"
                    onClick={() => markAsFulfilled(wishes[currentWishIndex].id)}
                  >
                    {wishes[currentWishIndex].fulfilled ? '标记为未实现' : '标记为已实现'}
                  </button>
                  <button 
                    className="share-button"
                    onClick={() => shareWish(wishes[currentWishIndex].id)}
                  >
                    <i className="fas fa-share-alt"></i> 分享
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => deleteWish(wishes[currentWishIndex].id)}
                  >
                    删除愿望
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {shareMode && currentWishIndex !== -1 && (
            <div className="wish-share">
              <div className="share-content">
                <div className="share-header">
                  <h3>分享你的愿望</h3>
                  <button className="close-button" onClick={cancelShare}>×</button>
                </div>
                
                <div className="share-body">
                  <p className="share-text">将你的愿望 "{wishes[currentWishIndex].text}" 分享给朋友</p>
                  
                  <div className="share-options">
                    <div className="share-option-title">通过短信分享你的愿望：</div>
                    
                    <div className="phone-input-container">
                      <div className="phone-input-wrapper">
                        <i className="fas fa-mobile-alt"></i>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="输入手机号码"
                          maxLength="11"
                          pattern="[0-9]*"
                        />
                      </div>
                      <button type="button" className="sms-share-button" onClick={sendSmsShare}>
                        <i className="fas fa-sms"></i> 发送短信
                      </button>
                    </div>
                    
                    {shareStatus && (
                      <p className={`share-status ${
                        shareStatus.includes('已打开') 
                          ? 'success' 
                          : shareStatus.includes('请输入') || shareStatus.includes('失败') 
                            ? 'error' 
                            : ''
                      }`}>
                        {shareStatus.includes('已打开') && <i className="fas fa-check-circle"></i>}
                        {(shareStatus.includes('请输入') || shareStatus.includes('失败')) && <i className="fas fa-exclamation-circle"></i>}
                        {shareStatus}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="share-actions">
                  <button className="cancel-button" onClick={cancelShare}>关闭</button>
                </div>
              </div>
            </div>
          )}
          
          <button 
            className="back-button"
            onClick={() => setShowIntro(true)}
          >
            <i className="fas fa-arrow-left"></i> 返回
          </button>
        </div>
      )}
    </div>
  );
};

export default WishingStar;
