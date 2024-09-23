'use client';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

interface CustomAudioProps {
  audio: HTMLAudioElement;
}

export default function CustomAudio({ audio }: CustomAudioProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  const [maxM, setMaxM] = useState<string | null>(null);
  const [nowM, setNowM] = useState<string>('00:00');

  const timeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audio.duration && e.nativeEvent.offsetX) {
      const fullWidth = progressRef.current.parentElement?.clientWidth || 0;
      const ratio = e.nativeEvent.offsetX / fullWidth;
      audio.currentTime = ratio * audio.duration;
    }
  };

  useEffect(() => {
    if (audio !== undefined) {
      // audio.ondurationchange = function() {
      const max = dayjs(audio.duration * 1000).format('mm:ss');
      setMaxM(max);
      // };
    }
  }, [audio]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }

    const drawProgress = (currTime: number, totalTime: number) => {
      if (progressRef.current) {
        progressRef.current.style.width = `${(currTime / totalTime) * 100}%`;
      }
    };

    const timeupdateHandler = () => {
      const { currentTime, duration } = audio;
      drawProgress(currentTime, duration);
      const now = dayjs(currentTime * 1000).format('mm:ss');
      setNowM(now);
    };

    if (audio !== undefined && audio.src) {
      audio.addEventListener('timeupdate', timeupdateHandler);
    }

    return () => {
      if (audio !== undefined) {
        audio.removeEventListener('timeUpdate', timeupdateHandler);
      }
    };
  }, [audio]);

  return (
    <div style={{ height: '50px', color: 'white', zIndex: '1000', position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          height: '0.7rem',
          width: '10rem',
          border: '1px solid magenta',
        }}
      >
        <span
          id="progress"
          ref={progressRef}
          style={{
            display: 'block',
            position: 'relative',
            height: '100%',
            backgroundColor: 'white',
          }}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <span>{nowM} / </span>
        <span>{maxM}</span>
      </div>
    </div>
  );
}
