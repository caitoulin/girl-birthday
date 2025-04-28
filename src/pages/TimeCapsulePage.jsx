import React, { useState } from "react";
import TimeCapsule from "../components/TimeCapsule";
import CapsuleMusic from "../components/CapsuleMusic";
import "../styles/timeCapsulePage.css";

const TimeCapsulePage = () => {
  const [capsuleOpened, setCapsuleOpened] = useState(false);

  // 设置解锁日期（这里设置为生日当天）
  const birthdayDate = new Date("2025-04-28T00:00:00");

  // 胶囊内容
  const capsuleMessages = [
    "亲爱的小宝，\n\n在你生日的这一天，我想告诉你，你是我生命中最美好的礼物。\n\n这里装着我对你的爱和祝福，希望它能给你带来惊喜和感动。\n\n生日快乐！",
    "我爱你，你辛苦了\n\n在咪咪心里，你永远都是最棒的。\n\n不管发生什么，我永远都是你最坚强的依靠",
    "我们一路走来不容易，我们一起经历了很多：\n\n我们一起玩，一起笑，一起哭，一起成长。\n\n每一刻都是那么珍贵，因为有你在我身,我才能更好,才能进步",
    "对未来，我有无限期待，\n\n期待和你一起创造更多美好回忆，\n期待和你一起实现我们的梦想，\n期待和你一起变老。\n\n我爱你，生日快乐，大兔兔！",
    "你要对自己有信心，对未来有信心，\n\n你是勤劳的小宝，你很棒！\n我也会努力把你照顾好\n辛苦了，我的老婆。\n\n我爱你！",
    "希望以后你的每一个生日，\n\n我都可以在你身边，在你需要的时候，我给你帮助！\n我在难过的时候，你给我鼓励\n我爱你\n\n喵喵！我很肥....",
  ];

  // 胶囊图片（示例使用Unsplash图片）
  const capsuleImages = [
    "/photo/cat.jpg",
    "/photo/cat.jpg",
    "/photo/cat.jpg",
    "/photo/cat.jpg",
    "/photo/cat.jpg",
    "/photo/cat.jpg",
  ];

  const handleCapsuleOpen = () => {
    setCapsuleOpened(true);

    // 旧的音乐播放代码保留但不执行，现在由CapsuleMusic组件处理
    // 如果需要临时音效，可以在这里添加
    try {
      const openSound = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-magical-surprise-appearance-860.mp3"
      );
      openSound.volume = 0.3;
      openSound.play().catch((e) => console.log("无法播放音效"));
    } catch (error) {
      console.log("音效播放错误:", error);
    }
  };

  return (
    <div className="time-capsule-page">
      <div className={`background ${capsuleOpened ? "celebration" : ""}`}>
        {capsuleOpened && (
          <div className="celebration-effects">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="capsule-page-content">
        <h1 className="page-title">特别的时间胶囊</h1>
        <p className="page-description">
          这是一个特别为你准备的时间胶囊，里面装满了我想对你说的话和我们珍贵的回忆。
          {!capsuleOpened ? "当时间到了，你就可以打开了" : "祝你生日快乐！小宝"}
        </p>

        <TimeCapsule
          unlockDate={birthdayDate}
          messages={capsuleMessages}
          images={capsuleImages}
          onUnlock={handleCapsuleOpen}
        />
      </div>

      {/* 添加音乐播放器组件 */}
      <CapsuleMusic isUnlocked={capsuleOpened} autoplay={capsuleOpened} />
    </div>
  );
};

export default TimeCapsulePage;
