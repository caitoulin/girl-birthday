import React, { useState, useEffect } from 'react';
import '../styles/game.css';

const Game = () => {
    const [message, setMessage] = useState('寻找隐藏的红色桃心');
  const [shapes, setShapes] = useState([]);
  const [foundHearts, setFoundHearts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(90);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [level, setLevel] = useState(1);
  const [hint, setHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // 基于难度级别的形状密度 - 大幅增加干扰形状数量
  const shapeDensity = {
    easy: 400,
    medium: 600,
    hard: 800
  };
  
  // 游戏难度配置 - 使用固定大小，增加形状数量
  const difficultySettings = {
    easy: {
      totalShapes: shapeDensity.easy,
      totalHearts: 8,
      timeLimit: 120, // 增加时间以应对更多形状
      maxHints: 3,
      minSize: 14,
      maxSize: 14, // 固定大小
      opacityRange: [0.4, 0.8]
    },
    medium: {
      totalShapes: shapeDensity.medium,
      totalHearts: 10,
      timeLimit: 120, // 增加时间以应对更多形状
      maxHints: 2,
      minSize: 12,
      maxSize: 12, // 固定大小
      opacityRange: [0.3, 0.7]
    },
    hard: {
      totalShapes: shapeDensity.hard,
      totalHearts: 12,
      timeLimit: 120, // 增加时间以应对更多形状
      maxHints: 1,
      minSize: 10,
      maxSize: 10, // 固定大小
      opacityRange: [0.2, 0.6]
    }
  };
  
  // 获取当前难度的设置
  const currentDifficulty = difficultySettings[difficulty];
  const totalHearts = currentDifficulty.totalHearts;

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setGameOver(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (foundHearts === totalHearts) {
      setGameCompleted(true);
      setGameOver(true);
    }
  }, [foundHearts, totalHearts]);
  
  // 使用更多种类的干扰形状
  const generateShapeSymbol = () => {
    // 干扰形状：增加更多形状种类
    const symbols = [
      '◆', '▲', '■', '●', '★', '✦', '✧', 
      '◇', '△', '□', '○', '☆', '✪', '✫', 
      '♦', '♠', '♣', '⬟', '⬢', '⬣', '⬤'
    ];
    return symbols[Math.floor(Math.random() * symbols.length)];
  };
  
  // 生成颜色
  const generateColor = () => {
    // 更广泛的颜色范围，包括红色系、粉色系和其他颜色
    const colors = [
      '#ff9eb5', '#ffb6c1', '#ffc0cb', '#ffd6e0', '#ffa6c9',
      '#ff91a4', '#ff8da1', '#ff7b93', '#ff5b79', '#ff4b6a',
      '#ff3355', '#ff1a40', '#ff0066', '#e60073', '#cc0066',
      '#ff99cc', '#ff66b2', '#ff3399', '#cc3399', '#993399',
      '#ffcccc', '#ff9999', '#ff6666', '#ff3333', '#ff0000'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 这段代码已经移到前面去了，这里删除

  const startGame = (selectedDifficulty = difficulty) => {
    setDifficulty(selectedDifficulty);
    const settings = difficultySettings[selectedDifficulty];
    
    // 生成形状（包括爱心和其他形状）
    const newShapes = [];
    
    // 创建网格系统，确保形状分布更均匀
    const gridSize = 5; // 将屏幕分成5x5的网格
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    
    // 先生成爱心，尝试均匀分布在网格中
    let heartsPlaced = 0;
    while (heartsPlaced < settings.totalHearts) {
      const gridX = Math.floor(Math.random() * gridSize);
      const gridY = Math.floor(Math.random() * gridSize);
      
      if (!grid[gridY][gridX]) {
        // 在这个网格单元内随机放置
        const cellWidth = 100 / gridSize;
        const cellHeight = 100 / gridSize;
        
        const left = gridX * cellWidth + Math.random() * (cellWidth * 0.6) + (cellWidth * 0.2);
        const top = gridY * cellHeight + Math.random() * (cellHeight * 0.6) + (cellHeight * 0.2);
        
        // 使用固定大小的桃心作为目标形状
        const size = settings.maxSize; // 固定大小
        
        newShapes.push({
          id: heartsPlaced,
          top: top,
          left: left,
          found: false,
          size: size, // 随机大小，与干扰形状完全相同范围
          isHeart: true,
          symbol: '♥', // 使用桃心作为目标形状
          color: '#ff0000', // 红色桃心
          rotation: 0, // 不旋转
          opacity: Math.random() * (settings.opacityRange[1] - settings.opacityRange[0]) + settings.opacityRange[0],
          zIndex: Math.floor(Math.random() * 10)
        });
        
        grid[gridY][gridX] = true;
        heartsPlaced++;
      }
    }
    
      // 更高效地生成大量干扰形状填满屏幕
      const remainingShapes = settings.totalShapes - settings.totalHearts;
      
      // 创建一个更均匀分布的网格来放置干扰形状
      const disturbGridSize = Math.ceil(Math.sqrt(remainingShapes)); // 计算网格大小
      const cellWidth = 100 / disturbGridSize;
      const cellHeight = 100 / disturbGridSize;
      
      // 生成足够的干扰形状填满屏幕
      for (let i = settings.totalHearts; i < settings.totalShapes; i++) {
        // 计算当前形状在网格中的位置
        const gridX = (i - settings.totalHearts) % disturbGridSize;
        const gridY = Math.floor((i - settings.totalHearts) / disturbGridSize);
        
        // 在网格单元内随机放置，但确保覆盖整个游戏区域
        const left = gridX * cellWidth + Math.random() * (cellWidth * 0.8);
        const top = gridY * cellHeight + Math.random() * (cellHeight * 0.8);
        
        const size = settings.maxSize; // 使用固定大小
        const symbol = generateShapeSymbol();
        
        newShapes.push({
          id: i,
          top: top,
          left: left,
          found: false,
          size: size,
          isHeart: false,
          symbol: symbol,
          color: generateColor(),
          rotation: Math.random() * 360,
          opacity: Math.random() * (settings.opacityRange[1] - settings.opacityRange[0]) + settings.opacityRange[0],
          zIndex: Math.floor(Math.random() * 10)
        });
      }
    
    // 打乱顺序
    for (let i = newShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
    }
    
    setShapes(newShapes);
    setFoundHearts(0);
    setTimer(settings.timeLimit);
    setGameStarted(true);
    setGameOver(false);
    setGameCompleted(false);
    setLevel(1);
    setHint(false);
    setHintsUsed(0);
  };

  const findShape = (id) => {
    if (gameOver) return;
    
    const clickedShape = shapes.find(shape => shape.id === id);
    
    if (clickedShape && clickedShape.isHeart) {
      // 点击了爱心 - 不改变大小
      setShapes(shapes.map(shape => 
        shape.id === id ? { 
          ...shape, 
          found: true, 
          opacity: 1,
          // 不修改任何可能影响大小的属性
        } : shape
      ));
      
      setFoundHearts(prev => prev + 1);
      
      // 播放爱心找到的动画效果
      const heartSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
      heartSound.volume = 0.3;
      heartSound.play().catch(e => console.log('无法播放音效'));
    } else {
      // 点击了错误的形状，轻微惩罚
      setTimer(prev => Math.max(prev - 2, 0));
      
      // 错误提示效果
      const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
      wrongSound.volume = 0.2;
      wrongSound.play().catch(e => console.log('无法播放音效'));
    }
  };
  
  const useHint = () => {
    if (hintsUsed >= currentDifficulty.maxHints) return;
    
    setHint(true);
    setHintsUsed(prev => prev + 1);
    
    // 3秒后关闭提示
    setTimeout(() => {
      setHint(false);
    }, 3000);
  };

  return (
    <div className="game-page">      
      {!gameStarted ? (
        <div className="game-intro">
          <p>这个游戏去商场每次遇到我们都会玩，所以这次我就用了这样一个创意。</p>
          <p>每找到一个爱心，都代表着我对你的一份爱意。</p>
          <p>但要小心，有些形状看起来很像爱心，却不是真正的爱心哦！</p>
          <p><strong>挑战：</strong>屏幕上布满了海量形状，找出所有<strong>红色的桃心</strong>！</p>
          <p><strong>提示：</strong>桃心隐藏在成百上千的各种形状之中，考验你的眼力和耐心！</p>
          
          <div className="difficulty-selection">
            <h3>选择难度：</h3>
            <div className="difficulty-buttons">
              <button 
                className={`difficulty-button ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                简单 (8个爱心)
              </button>
              <button 
                className={`difficulty-button ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                中等 (10个爱心)
              </button>
              <button 
                className={`difficulty-button ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                困难 (12个爱心)
              </button>
            </div>
          </div>
          
          <button className="start-button" onClick={() => startGame(difficulty)}>开始游戏</button>
        </div>
      ) : (
        <div className="game-area">
          <div className="game-stats">
            <div className="hearts-found">找到的红色桃心: {foundHearts}/{totalHearts}</div>
            <div className={`timer ${timer <= 10 ? 'warning' : ''}`}>剩余时间: {timer}秒</div>
            <div className="hints">
              <button 
                className="hint-button" 
                onClick={useHint}
                disabled={hint || hintsUsed >= currentDifficulty.maxHints}
              >
                提示 ({currentDifficulty.maxHints - hintsUsed}/{currentDifficulty.maxHints})
              </button>
            </div>
          </div>
          
          <div className="shapes-container">
            {shapes.map(shape => (
              <div 
                key={shape.id}
                className={`shape ${shape.found ? 'found' : ''} ${shape.isHeart ? 'target' : 'decoy'} ${hint && shape.isHeart && !shape.found ? 'hint-glow' : ''}`}
                style={{
                  top: `${shape.top}%`,
                  left: `${shape.left}%`,
                  fontSize: `${shape.size}px`,
                  color: shape.color,
                  transform: `rotate(${shape.rotation}deg)`,
                  opacity: hint && shape.isHeart && !shape.found ? 0.9 : shape.opacity,
                  zIndex: shape.zIndex,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`
                }}
                onClick={() => !shape.found && findShape(shape.id)}
              >
                {shape.symbol}
              </div>
            ))}
          </div>
          
          {gameOver && (
            <div className="game-over">
              <h2>{gameCompleted ? '恭喜你找到了所有爱心！' : '游戏结束'}</h2>
              <p>你找到了 {foundHearts} 个爱心，代表着我对你满满的爱意！</p>
              {gameCompleted && (
                <p className="special-message">就像这些爱心一样，我的爱藏在生活的每个角落，等你发现。</p>
              )}
              <div className="game-over-buttons">
                <button className="restart-button" onClick={() => startGame(difficulty)}>再玩一次</button>
                <button className="home-button" onClick={() => setGameStarted(false)}>返回选择</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
