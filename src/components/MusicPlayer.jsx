import React, { useState, useRef, useEffect } from "react";
import "../styles/musicPlayer.css";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  const songs = [
    {
      title: "兔兔生日歌",
      artist: "Birthday Song",
      url: "../../video/cat.mp3",
    },
  ];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSong((currentSong + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSong((currentSong - 1 + songs.length) % songs.length);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={songs[currentSong].url} onEnded={nextSong} />
      <div className="song-info">
        <h3>{songs[currentSong].title}</h3>
        <p>{songs[currentSong].artist}</p>
      </div>
      <div className="controls">
        <button onClick={togglePlay} className="control-btn play-btn">
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
