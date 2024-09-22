'use client';
import styles from '@/styles/modern-move.module.css';
import { useEffect, useRef } from 'react';

interface CrackRandomProps {
  width: number;
  height: number;
  crack: {
    xx: number;
    yy: number;
  };
}

export default function CrackRandom({ width, height, crack }: CrackRandomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function drawComplexCrack(x: number, y: number) {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      const length = Math.random() * 50 + 10; //20
      const angle = Math.random() * 2 * Math.PI;

      let currentX = x;
      let currentY = y;
      let currentAngle = angle;

      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x, y);

      function drawBranchCrack(
        x: number,
        y: number,
        length: number,
        angle: number,
        ctx: CanvasRenderingContext2D,
      ) {
        let currentX = x;
        let currentY = y;
        let currentAngle = angle;

        ctx.moveTo(x, y);

        for (let i = 0; i < length; i += 5) {
          const offsetAngle = (Math.random() - 0.5) * (Math.PI / 12); // 6
          currentAngle += offsetAngle;

          currentX += 5 * Math.cos(currentAngle);
          currentY += 5 * Math.sin(currentAngle);

          ctx.lineTo(currentX, currentY);
        }
      }

      for (let i = 0; i < length; i += 5) {
        const offsetAngle = (Math.random() - 0.5) * (Math.PI / 6); // 최대 30도의 편차
        currentAngle += offsetAngle;

        currentX += 15 * Math.cos(currentAngle);
        currentY += 15 * Math.sin(currentAngle);

        ctx.lineTo(currentX, currentY);

        if (Math.random() > 0.7) {
          // 30% 확률로 균열 분기
          const branchLength = Math.random() * 30 + 10;
          const branchAngle = currentAngle + (Math.random() - 0.5) * (Math.PI / 2); // 현재 각도를 기준으로 최대 90도 편차

          drawBranchCrack(currentX, currentY, branchLength, branchAngle, ctx);
        }
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // 3개에서 5개의 랜덤한 균열을 생성
    const numCracks = Math.floor(Math.random() * 3) + 8;

    for (let i = 0; i < numCracks; i++) {
      drawComplexCrack(crack.xx, crack.yy);
    }
  }, [crack]);

  return (
    <div style={{ position: 'absolute', width: width, height: height, zIndex: '10' }}>
      <div className={styles.drawing}>
        <canvas
          ref={canvasRef}
          style={{ position: 'relative', width: width, height: height }}
          width={width}
          height={height}
        ></canvas>
      </div>
    </div>
  );
}
