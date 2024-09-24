'use client';

import styles from '@/styles/eclipse.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SelectComp from './selectcomp';

export default function SinopVideo() {
  const fullText = `메두사 호는 제2의 지구 탐색을 위해 우주로 여정을 떠났습니다.`;

  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [seq, setSeq] = useState(0);
  const [videoSrc, setVideoSrc] = useState('/assets/mp4/eclipsesample.mp4');
  const [startModal, setStartModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setSeq(2);
    setStartModal(false);
  };

  useEffect(() => {
    if (index < fullText.length) {
      setTimeout(() => {
        setText(text + fullText.charAt(index));
        setIndex(index + 1);
      }, 50); // 타이핑 속도 조절
    } else if (index === fullText.length) {
      setTimeout(() => {
        setSeq(1);
        setVideoSrc('/assets/mp4/eclipsesample2.mp4');
      }, 2000);
    }
  }, [index]);

  useEffect(() => {
    if (seq === 1 && videoRef.current) {
      setIndex(0);
      setText('');
      videoRef.current.onended = () => {
        setStartModal(true);
      };
    }
  }, [seq]);

  return (
    <>
      {startModal && (
        <div className={styles.modal}>
          <p onClick={handleStart}>임무시작</p>
        </div>
      )}
      <div className={styles.videopage}>
        <div className={styles.sinopvideo}>
          {seq === 2 ? (
            <Image
              className={styles.videocontents}
              src="/assets/img/eclipse/seq0.jpeg"
              alt="seq0"
              fill
              unoptimized
            />
          ) : (
            <video
              ref={videoRef}
              className={styles.videocontents}
              src={videoSrc}
              autoPlay
              // loop
            ></video>
          )}
          {seq === 2 ? (
            <SelectComp />
          ) : (
            <div className={styles.sinopp}>
              <p>{text}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
