import React, { useState, useEffect, useRef } from 'react';
import '../styles/capsuleMusic.css';

const CapsuleMusic = ({ isUnlocked, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);
  
  // 歌曲信息
  const songInfo = {
    title: "生日祝福",
    artist: "特别的旋律",
    // 这里使用了一首免费的背景音乐，你可以替换为你喜欢的歌曲
    src: "../../video/cat-long.mp3",
  };
  
  // 当时间胶囊解锁时自动播放音乐
  useEffect(() => {
    if (isUnlocked && autoplay && audioRef.current) {
      // 短暂延迟确保DOM已完全加载
      const timer = setTimeout(() => {
        playAudio();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, autoplay]);
  
  // 音量变化时更新音频元素
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // 播放/暂停音频
  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 播放前先加载
        audioRef.current.load();
        
        // 尝试播放
        const playPromise = audioRef.current.play();
        
        // 处理可能的播放错误（浏览器可能会阻止自动播放）
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // 播放成功
          }).catch(error => {
            console.log('自动播放被阻止，需要用户交互: ', error);
            setIsPlaying(false);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // 调整音量
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };
  
  // 切换控制面板显示
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  // 如果时间胶囊未解锁，不显示音乐播放器
  if (!isUnlocked) return null;
  
  return (
    <div className={`capsule-music ${showControls ? 'expanded' : ''}`}>
      <audio ref={audioRef} loop>
        <source src={songInfo.src} type="audio/mp3" />
        您的浏览器不支持音频播放。
      </audio>
      
      <div className="music-toggle" onClick={toggleControls}>
        <i className={`fas ${showControls ? 'fa-chevron-down' : 'fa-music'}`}></i>
      </div>
      
      {showControls && (
        <div className="music-controls">
          <div className="song-info">
            <div className="song-title">{songInfo.title}</div>
            <div className="song-artist">{songInfo.artist}</div>
          </div>
          
          <div className="playback-controls">
            <button className="play-button" onClick={playAudio}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            
            <div className="volume-control">
              <i className="fas fa-volume-down"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={handleVolumeChange} 
                className="volume-slider"
              />
              <i className="fas fa-volume-up"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapsuleMusic;
