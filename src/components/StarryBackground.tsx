// components/StarryBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface StarColor {
  r: number;
  g: number;
  b: number;
}

class Star {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speed: number = 0;
  brightness: number = 0;
  color: StarColor = { r: 0, g: 0, b: 0 };
  canvasWidth: number;
  canvasHeight: number;
  twinkleSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.twinkleSpeed = Math.random() * 0.015 + 0.005;
    this.reset();
  }

  reset(): void {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.size = Math.random() * 2.5 + 0.5;
    this.speed = Math.random() * 0.3 + 0.1;
    this.brightness = Math.random();
    
    // ランダムな星の色を生成
    const colorType = Math.random();
    if (colorType < 0.2) {
      // 青っぽい星 (20%)
      this.color = {
        r: Math.floor(Math.random() * 100 + 155),
        g: Math.floor(Math.random() * 100 + 155),
        b: 255
      };
    } else if (colorType < 0.4) {
      // 赤っぽい星 (20%)
      this.color = {
        r: 255,
        g: Math.floor(Math.random() * 100 + 155),
        b: Math.floor(Math.random() * 100 + 155)
      };
    } else if (colorType < 0.6) {
      // 黄色っぽい星 (20%)
      this.color = {
        r: 255,
        g: 255,
        b: Math.floor(Math.random() * 100 + 155)
      };
    } else if (colorType < 0.8) {
      // 紫っぽい星 (20%)
      this.color = {
        r: 255,
        g: Math.floor(Math.random() * 100),
        b: 255
      };
    } else {
      // 白い星 (20%)
      this.color = {
        r: 255,
        g: 255,
        b: 255
      };
    }
  }

  update(): void {
    // 明滅のアニメーション
    this.brightness += Math.sin(Date.now() * this.twinkleSpeed) * 0.015;
    this.brightness = Math.max(0.3, Math.min(1, this.brightness));
    
    this.y += this.speed;
    if (this.y > this.canvasHeight) {
      this.reset();
      this.y = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );

    const { r, g, b } = this.color;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.brightness})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // キャンバスサイズが変更されたら星を再生成
      starsRef.current = Array.from(
        { length: 250 },
        () => new Star(canvas.width, canvas.height)
      );
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // アニメーションループ
    const animate = () => {
      if (!canvas || !ctx) return;

      // 背景のグラデーション
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 10, 30, 0.2)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-gray-900 to-black"
      aria-hidden="true"
    />
  );
};

export default StarryBackground;