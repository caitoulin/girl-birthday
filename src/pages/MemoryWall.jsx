import React, { useState, useEffect } from "react";
import CatIcon from '../components/CatIcon';
import "../styles/memoryWall.css";

const MemoryWall = () => {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState("");
  const [animation, setAnimation] = useState(false);

  // 预设的一些回忆
  const initialMemories = [
    "记得我们第一次见面时，在教三会议室，看到你好白，笑得那么好看，人群中觉得你就是我的女朋友啦,生日快乐!",
    "那次我的手被刀削了，晚上你见到我的时候，看到你的哭了，我既心动也心疼，我不想你为我如此担心,生日快乐!",
    "我们一起看的第一场电影是什么来着？这辈子都不会忘记，美人鱼,生日快乐!",
    "还记得每次分别前，我都很不舍得，默默的掏出手机，然后就说操作两把，赢了就开心，输了就是没保护好，想起来也好开心,生日快乐!",
    "即使后来，我们没能在一所学校，可是我依然认为小宝是我心里最优秀的宝宝，身上依然有那么多特质!,生日快乐!",
    "后来我们一起北漂，一起努力，即使经历了一些磨难，还在我们现在结婚🎎了，还在一起开心生活,生日快乐!",
    "我们一起生活、一起旅游、一起吃东西，很多小而美的回忆，我喜欢吃你做的好多菜,生日快乐!",
    "未来的日子里，我们一起努力，一起加油，一起快乐，生日快乐！",
    "我最喜欢你，你最喜欢我，我们最喜欢 ourselves，生日快乐!",
  ];

  useEffect(() => {
    // 加载预设的回忆
    setMemories(initialMemories);
  }, []);

  const addMemory = (e) => {
    e.preventDefault();
    if (newMemory.trim() !== "") {
      setMemories([...memories, newMemory]);
      setNewMemory("");
      setAnimation(true);
      setTimeout(() => setAnimation(false), 1000);
    }
  };

  return (
    <div className="memory-wall-page">
      <h1 className="memory-wall-title">我们的回忆墙</h1>
      <p className="memory-wall-subtitle">每一段回忆都是我们爱的故事</p>

      <div className="memory-wall">
        {memories.map((memory, index) => (
          <div
            key={index}
            className={`memory-note ${
              index === memories.length - 1 && animation ? "animate" : ""
            }`}
            style={{
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
              backgroundColor: `hsl(${Math.random() * 60 + 40}, 100%, 85%)`,
            }}
          >
            <p>
              {memory.split("").map((char, charIndex) => (
                <span key={charIndex}>
                  {char}
                  {/* 在每个字符后添加猫咪图标，但使用不同的变体和大小 */}
                  {(charIndex + 1) % 5 === 0 && (
                    <CatIcon
                      variant={(index + charIndex) % 5}
                      size={14 + Math.floor(Math.random() * 4)}
                    />
                  )}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <form className="add-memory-form" onSubmit={addMemory}>
        <h3>添加新回忆</h3>
        <textarea
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          placeholder="写下你想记录的回忆..."
          rows="3"
        />
        <button type="submit">添加到回忆墙</button>
      </form>
    </div>
  );
};

export default MemoryWall;
