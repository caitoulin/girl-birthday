import React, { useEffect, useRef } from "react";
import "../styles/fireworks.css";

// 烟花类型枚举
const FireworkTypes = {
  BURST: "burst", // 爆裂型
  TRAIL: "trail", // 拖尾型
  SPARKLE: "sparkle", // 闪烁型
  HEART: "heart", // 心形
  STAR: "star", // 星形
  SPIRAL: "spiral", // 螺旋型
};

const Fireworks = ({
  type = FireworkTypes.BURST,
  color = null,
  container = null,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // 根据类型生成随机颜色
  const getColor = () => {
    if (color) return color;

    // 不同类型的烟花有不同的颜色范围，使用更柔和的颜色
    switch (type) {
      case FireworkTypes.BURST:
        return `hsl(${Math.random() * 20 + 340}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和粉红色系
      case FireworkTypes.TRAIL:
        return `hsl(${Math.random() * 40 + 200}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和蓝色系
      case FireworkTypes.SPARKLE:
        return `hsl(${Math.random() * 40 + 100}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和绿色系
      case FireworkTypes.HEART:
        return `hsl(${Math.random() * 40 + 20}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和橙色系
      case FireworkTypes.STAR:
        return `hsl(${Math.random() * 40 + 260}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和紫色系
      case FireworkTypes.SPIRAL:
        return `hsl(${Math.random() * 40 + 180}, 80%, ${
          Math.random() * 15 + 75
        }%)`; // 柔和青色系
      default:
        return `hsl(${Math.random() * 360}, 80%, 80%)`;
    }
  };

  // 粒子类
  class Particle {
    constructor(x, y, size, color, velocityX, velocityY, type) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = "red";
      this.velocityX = velocityX;
      this.velocityY = velocityY;
      this.gravity = 0.03; // 减小重力，使粒子下落更慢
      this.friction = 0.995; // 增加摩擦力，使粒子运动更平滑
      this.life = 120; // 增加生命周期
      this.opacity = 1;
      this.type = type;
      this.angle = Math.random() * Math.PI * 2; // 用于螺旋和特殊形状
      this.rotationSpeed = (Math.random() - 0.5) * 0.1; // 旋转速度
    }

    update() {
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      this.velocityY += this.gravity;

      // 螺旋型特殊运动
      if (this.type === FireworkTypes.SPIRAL) {
        this.angle += this.rotationSpeed;
        const radius = this.life / 10;
        const offsetX = Math.cos(this.angle) * radius;
        const offsetY = Math.sin(this.angle) * radius;
        this.x += this.velocityX + offsetX * 0.1;
        this.y += this.velocityY + offsetY * 0.1;
      } else {
        this.x += this.velocityX;
        this.y += this.velocityY;
      }

      this.life -= 0.5; // 减慢生命消耗速度
      this.opacity = this.life / 120;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // 根据类型绘制不同形状
      switch (this.type) {
        case FireworkTypes.HEART:
          this.drawHeart(ctx);
          break;
        case FireworkTypes.STAR:
          this.drawStar(ctx);
          break;
        case FireworkTypes.TRAIL:
          this.drawTrail(ctx);
          break;
        case FireworkTypes.SPARKLE:
          this.drawSparkle(ctx);
          break;
        case FireworkTypes.SPIRAL:
          this.drawSpiral(ctx);
          break;
        default:
          this.drawCircle(ctx);
      }

      ctx.restore();
    }

    drawCircle(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    drawTrail(ctx) {
      // 绘制拖尾效果
      const tailLength = 5;
      const gradient = ctx.createLinearGradient(
        this.x - this.velocityX * tailLength,
        this.y - this.velocityY * tailLength,
        this.x,
        this.y
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, this.color);

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.moveTo(
        this.x - this.velocityX * tailLength,
        this.y - this.velocityY * tailLength
      );
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    drawSparkle(ctx) {
      // 闪烁效果
      const flicker = Math.random() > 0.5 ? 1 : 0.5;
      ctx.globalAlpha = this.opacity * flicker;

      // 绘制十字星
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y);
      ctx.lineTo(this.x + this.size, this.y);
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x, this.y + this.size);
      ctx.lineWidth = this.size / 2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }

    drawHeart(ctx) {
      const size = this.size * 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - size / 4);
      ctx.bezierCurveTo(
        this.x - size / 2,
        this.y - size / 2,
        this.x - size / 2,
        this.y + size / 4,
        this.x,
        this.y + size / 2
      );
      ctx.bezierCurveTo(
        this.x + size / 2,
        this.y + size / 4,
        this.x + size / 2,
        this.y - size / 2,
        this.x,
        this.y - size / 4
      );
      ctx.fill();
    }

    drawStar(ctx) {
      const spikes = 5;
      const outerRadius = this.size;
      const innerRadius = this.size / 2;

      let rot = (Math.PI / 2) * 3;
      let x = this.x;
      let y = this.y;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = this.x + Math.cos(rot) * outerRadius;
        y = this.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = this.x + Math.cos(rot) * innerRadius;
        y = this.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(this.x, this.y - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    drawSpiral(ctx) {
      // 螺旋效果
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.size * (1 + Math.sin(this.angle) * 0.3),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    isAlive() {
      return this.life > 0;
    }
  }

  // 创建烟花爆炸效果
  const createFirework = (x, y, particleCount = 25) => {
    const particles = [];
    const fireworkColor = getColor();

    for (let i = 0; i < particleCount; i++) {
      // 根据烟花类型调整粒子行为
      let size, velocityX, velocityY;

      switch (type) {
        case FireworkTypes.BURST:
          // 爆裂型 - 向四周发散
          size = Math.random() * 1.5 + 0.5;
          velocityX = (Math.random() - 0.5) * 2;
          velocityY = (Math.random() - 0.5) * 2;
          break;
        case FireworkTypes.TRAIL:
          // 拖尾型 - 下落较慢
          size = Math.random() * 1.2 + 0.5;
          velocityX = (Math.random() - 0.5) * 1.5;
          velocityY = (Math.random() - 0.5) * 1.5;
          break;
        case FireworkTypes.SPARKLE:
          // 闪烁型 - 较小且移动较慢
          size = Math.random() * 0.8 + 0.5;
          velocityX = (Math.random() - 0.5) * 1;
          velocityY = (Math.random() - 0.5) * 1;
          break;
        case FireworkTypes.HEART:
          // 心形 - 较大且移动较慢
          size = Math.random() * 1 + 0.5;
          velocityX = (Math.random() - 0.5) * 0.8;
          velocityY = (Math.random() - 0.5) * 0.8 - 0.2; // 向上飘
          break;
        case FireworkTypes.STAR:
          // 星形 - 较大且移动较慢
          size = Math.random() * 1 + 0.5;
          velocityX = (Math.random() - 0.5) * 1;
          velocityY = (Math.random() - 0.5) * 1;
          break;
        case FireworkTypes.SPIRAL:
          // 螺旋型 - 特殊运动
          size = Math.random() * 0.8 + 0.5;
          velocityX = (Math.random() - 0.5) * 0.3; // 较小的初始速度
          velocityY = (Math.random() - 0.5) * 0.3;
          break;
        default:
          size = Math.random() * 1.5 + 0.5;
          velocityX = (Math.random() - 0.5) * 2;
          velocityY = (Math.random() - 0.5) * 2;
      }

      particles.push(
        new Particle(x, y, size, fireworkColor, velocityX, velocityY, type)
      );
    }

    return particles;
  };

  // 处理动画
  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 清空画布，使用极低不透明度的黑色来创建微弱拖尾效果
    // 设置初始背景色
    ctx.fillStyle = "#ffd6e0"; // 浅绿色背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有粒子
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.update();
      particle.draw(ctx);
      return particle.isAlive();
    });

    // 随机决定是否触发新的烟花
    if (Math.random() < 0.03 && particlesRef.current.length < 150) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const newParticles = createFirework(x, y);
      particlesRef.current.push(...newParticles);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // 初始化一些烟花
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    particlesRef.current = createFirework(centerX, centerY);

    // 开始动画
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [container, type]);

  return <canvas ref={canvasRef} className="fireworks-canvas" />;
};

export { Fireworks, FireworkTypes };
