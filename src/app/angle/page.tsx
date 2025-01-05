"use client";
import React, { useState, useEffect, useRef } from "react";
import { Compass } from "lucide-react";
import { create, all } from "mathjs";

// 高精度な数学計算のための設定
const math = create(all, {
  precision: 64,
  number: "BigNumber",
});

const AngleMeter = () => {
  const [angle, setAngle] = useState(0);
  const [precision, setPrecision] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // マウスの動きを追跡して角度を計算
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;

      // arctanを使用して高精度な角度計算
      const radians = math.atan2(y, x);
      const degrees = math.multiply(radians, 180 / math.pi);

      // 正規化して0-360の範囲に収める
      const normalizedDegrees = math.mod(math.add(degrees, 360), 360);
      setAngle(Number(normalizedDegrees.toFixed(precision)));
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [precision]);

  // 円と角度を描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 円を描画
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 角度マーカーを描画
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const angleRad = (angle * Math.PI) / 180;
    ctx.lineTo(
      centerX + radius * Math.cos(angleRad),
      centerY + radius * Math.sin(angleRad)
    );
    ctx.strokeStyle = "#0066cc";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 目盛りを描画
    for (let i = 0; i < 360; i += 15) {
      const rad = (i * Math.PI) / 180;
      const startRadius = i % 90 === 0 ? radius - 15 : radius - 10;

      ctx.beginPath();
      ctx.moveTo(
        centerX + startRadius * Math.cos(rad),
        centerY + startRadius * Math.sin(rad)
      );
      ctx.lineTo(
        centerX + radius * Math.cos(rad),
        centerY + radius * Math.sin(rad)
      );
      ctx.strokeStyle = "#666";
      ctx.lineWidth = i % 90 === 0 ? 2 : 1;
      ctx.stroke();

      // 90度ごとに数値を表示
      if (i % 90 === 0) {
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textRadius = radius - 25;
        ctx.fillText(
          `${i}°`,
          centerX + textRadius * Math.cos(rad),
          centerY + textRadius * Math.sin(rad)
        );
      }
    }
  }, [angle]);

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">高精度角度計</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">精度:</label>
          <select
            className="border rounded p-1"
            value={precision}
            onChange={(e) => setPrecision(Number(e.target.value))}
          >
            {[2, 3, 4, 5, 6].map((p) => (
              <option key={p} value={p}>
                {p}桁
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full border rounded-lg cursor-crosshair"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow">
          <span className="text-lg font-mono">{angle.toFixed(precision)}°</span>
        </div>
      </div>
    </div>
  );
};

export default AngleMeter;
