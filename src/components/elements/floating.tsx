'use client';
import styles from '@/app/page.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface FloatingProps {
  zindex?: number;
  scalex?: string;
  src: string;
}

const randomPosition = (boundary: Record<string, number>, position: Record<string, number>) => {
  const maxDistance = 200;
  const dx = (Math.random() - 0.5) * maxDistance;
  const dy = (Math.random() - 0.5) * maxDistance;

  return {
    top: Math.min(Math.max(boundary.top, position.top + dy), boundary.top + boundary.height),
    left: Math.min(Math.max(boundary.left, position.left + dx), boundary.left + boundary.width),
  };
};

export default function Floating({ zindex, scalex, src }: FloatingProps) {
  const boundaryRef = useRef<Record<string, number>>({
    width: window.innerWidth,
    height: window.innerHeight * 0.6,
    left: 0,
    top: window.innerHeight * 0.2,
  });
  const rAfId = useRef<number | null>(null);
  const [position, setPosition] = useState<Record<string, number>>({
    top: document.documentElement.clientHeight * Math.random(),
    left: document.documentElement.clientWidth * Math.random(),
  });

  useEffect(() => {
    const moveFish = () => {
      setPosition((prev) => {
        const newPosition = randomPosition(boundaryRef.current, prev);
        return newPosition;
      });

      setTimeout(() => {
        rAfId.current = requestAnimationFrame(moveFish);
      }, 1500);
    };
    // 애니메이션 시작
    rAfId.current = requestAnimationFrame(moveFish);

    return () => {
      if (rAfId.current) {
        cancelAnimationFrame(rAfId.current);
      }
    };
  }, []);

  return (
    <Image
      src={src}
      alt="Floating Fish"
      className={styles.floating}
      style={{ top: position.top, left: position.left, zIndex: zindex, transform: scalex }}
      unoptimized
    />
  );
}
