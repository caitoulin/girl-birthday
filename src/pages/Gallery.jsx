import React, { useState } from "react";
import "../styles/gallery.css";

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // 这里放上一些示例图片，实际使用时可以替换成你们的照片
  const photos = [
    {
      url: "/photo/5.jpg",
      caption: "我们的第一次约拍,我真的瘦吗？原来我是小胖子",
    },
    {
      url: "/photo/4.jpg",
      caption: "这张照片真的很喜欢,很少看到我的宝宝会这样,火锅真好吃!",
    },
    {
      url: "/photo/3.jpg",
      caption: "这是拍婚纱照那天，我们都好开心，我们太开心了!的眼睛都不见了",
    },
    {
      url: "/photo/7.jpg",
      caption: "这是谁呀！好美呀，原来是我的老婆呀！生日快乐宝宝！",
    },
    {
      url: "/photo/8.jpg",
      caption: "这是带兔帽的宝宝，真美呀，真美呀！下次就带你买一个兔帽子吧！",
    },
    {
      url: "/photo/6.jpg",
      caption: "这是你去年的生日，主人别生气，今年我一定好好拍｜生日快乐呀兔兔",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((activeIndex + 1) % photos.length);
    setIsZoomed(false);
  };

  const prevSlide = () => {
    setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
    setIsZoomed(false);
  };

  const toggleZoom = (e) => {
    e.preventDefault(); // 阻止默认行为
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">我们的照片墙</h1>
      <p className="gallery-subtitle">每一张照片都是我们爱的见证</p>

      <div className={`carousel ${isZoomed ? "zoomed" : ""}`}>
        <button className="carousel-button prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="carousel-content">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`carousel-item ${
                index === activeIndex ? "active" : ""
              }`}
              style={{
                transform: `translateX(${(index - activeIndex) * 100}%)`,
              }}
            >
              <img
                src={photo.url}
                style={{
                  objectFit: "contain",
                }}
                alt={photo.caption}
                onClick={toggleZoom}
                className={isZoomed ? "zoomed" : ""}
              />
              <div className="carousel-caption">{photo.caption}</div>
            </div>
          ))}
        </div>

        <button className="carousel-button next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        {isZoomed && (
          <div className="zoom-overlay" onClick={toggleZoom}>
            <div className="zoom-instructions">点击任意位置退出放大模式</div>
          </div>
        )}
      </div>

      <div className="carousel-indicators">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <div className="gallery-message">
        <p>这些照片记录了我们在一起的美好时光，</p>
        <p>期待未来和你创造更多美好的回忆。</p>
      </div>
    </div>
  );
};

export default Gallery;
