'use client';
import styles from '@/app/modernmove/page.module.css';
import { animated, useSpring } from '@react-spring/web';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VaporwaveScene2dProps {
  threeD: boolean;
  ready: boolean;
  audio: HTMLAudioElement;
  play: boolean;
}

export default function VaporwaveScene2d({ threeD, ready, audio, play }: VaporwaveScene2dProps) {
  const [isLoaded, setIsLoaded] = useState(false); // 이미지 로드 상태를 추적하는 상태 변수
  const { opacity } = useSpring({ opacity: threeD ? 0 : 1 }); // 3d 캔바스 로드되기 전까지 0 으로 유지기능 추가할것 isLoaded && threeD

  const [earth, setEarth] = useState(false);
  const earthRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (ready) {
      let timer = setTimeout(() => {
        setIsLoaded(true); // 이미지가 로드되면 상태를 업데이트합니다.
        console.log('Image loaded!');
        clearTimeout(timer);
      }, 1000);
    }
  };

  useEffect(() => {
    function recieve() {
      if (!earthRef.current) return;
      let curr = audio.currentTime;
      if (curr > 3 && curr < 3.3 && play) {
        setEarth(true);
        earthRef.current.style.transform = 'translateY(180px)';
      }
      if (curr > 9 && curr < 9.3 && play) {
        setEarth(false);
      }
      if (curr > 15 && curr < 15.3 && play) {
      }
      if (curr > 21 && curr < 21.3 && play) {
      }
      if (curr > 27 && curr < 27.3 && play) {
      }
      if (curr > 33 && curr < 33.3 && play) {
      }
      if (curr > 39 && curr < 39.3 && play) {
      }
      if (curr > 45 && curr < 45.3 && play) {
      }
      if (curr > 51 && curr < 51.3 && play) {
      }
      if (curr > 57 && curr < 57.3 && play) {
      }
      if (curr > 63 && curr < 63.3 && play) {
      }
      if (curr > 69 && curr < 69.3 && play) {
      }
      if (curr > 75 && curr < 75.3 && play) {
      }
      if (curr > 81 && curr < 81.3 && play) {
      }
      if (curr > 87 && curr < 87.5 && play) {
      }
      if (curr > 93 && curr < 93.3 && play) {
      }
      if (curr > 99 && curr < 99.3 && play) {
      }
      if (curr > 99 && curr < 99.3 && play) {
      }
      if (curr > 105 && curr < 105.3 && play) {
      }
      if (curr > 126 && curr < 126.3 && play) {
      }
    }

    if (audio) {
      audio.addEventListener('timeupdate', recieve);
    }

    return () => {
      audio?.removeEventListener('timeupdate', recieve);
    };
  }, [audio, play]);

  return (
    <animated.div
      className={styles.canvas2d}
      style={{ opacity: opacity, position: 'absolute', zIndex: '1' }}
    >
      <Image
        ref={earthRef}
        src="/assets/gifs/earth3.gif"
        style={{
          position: 'absolute',
          top: '130px',
          zIndex: '2',
          opacity: earth ? '1' : '0',
          transition: 'transform 7s',
        }}
        alt="earth"
        unoptimized
      />
      <Image
        className={styles.canvas2dback}
        style={{ zIndex: '1' }}
        src="/assets/gifs/momoback_sq.gif"
        alt="modernmove_2d"
        onLoad={handleImageLoad}
        unoptimized
      />
    </animated.div>
  );
}
