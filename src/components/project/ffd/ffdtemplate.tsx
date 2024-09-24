'use client';

import { FfdCarousel, FfdDrag, FfdModal } from '@/components/project/ffd';
import styles from '@/styles/ffd.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface FfdTemplateProps {
  imgs: string[];
}

export default function FfdTemplate({ imgs }: FfdTemplateProps) {
  const [redBtn, setRedBtn] = useState(true);
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [relayPlay, setRelayPlay] = useState(false);
  const [currTime, setCurrTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const secondsRef = useRef(0);

  const scrollBottom = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gridRef.current) return;
    // 스크롤 가능한 최대 높이 계산
    const maxScrollTop = gridRef.current.scrollHeight - gridRef.current.clientHeight;

    if ('scrollBehavior' in document.documentElement.style) {
      if (mobile) {
        // 현재 스크롤 위치 + 이동하려는 거리가 최대 스크롤 위치를 넘지 않도록 조정
        const newScrollTop = Math.min(gridRef.current.scrollTop + 300, maxScrollTop);

        gridRef.current.scrollBy({
          top: newScrollTop - gridRef.current.scrollTop, // 실제로 이동해야 하는 거리 계산
          behavior: 'smooth',
        });
      } else {
        gridRef.current.scroll({
          top: maxScrollTop, // 최대 스크롤 높이로 설정
          behavior: 'smooth',
        });
      }
    } else {
      gridRef.current.scrollTo(0, maxScrollTop); // 부드러운 스크롤이 지원되지 않을 때
    }
  };

  const scrollTop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gridRef.current) return;
    if ('scrollBehavior' in document.documentElement.style) {
      // 부드러운 스크롤이 지원되면 사용
      gridRef.current.scroll({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // 부드러운 스크롤이 지원되지 않으면 기본 스크롤 사용
      gridRef.current.scrollTo(0, 0);
    }
  };

  const songStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'calc(var(--vh, 1vh) * 100)';

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => {
          console.log('막을 클릭?');
          setRedBtn(false);
        })
        .catch((e) => {
          console.log('재생 실패:', e);
        });
    }
  };

  const songStartTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'calc(var(--vh, 1vh) * 100)';
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => {
          console.log('핵무기 버튼 클릭됨!');
          setRedBtn(false);
        })
        .catch((e) => {
          console.log('재생 실패:', e);
        });
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audioElement = e.currentTarget;
    setCurrTime(audioElement.currentTime);
  };

  const handleTvClick = () => {
    setShowModal(true);
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const handleCarouselClick = () => {
    console.log('클릭됨!');
    setShowCarousel(true);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const sum = audioRef.current.currentTime + secondsRef.current;
    if (sum <= audioRef.current.duration) {
      audioRef.current.currentTime = sum;
    }
    if (relayPlay === false && audioRef.current.ended === false && !showModal && !redBtn) {
      audioRef.current.play();
      setRelayPlay(true);
    }
  }, [relayPlay, showModal, redBtn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showModal) {
      interval = setInterval(() => {
        secondsRef.current = secondsRef.current + 1;
      }, 1000);
    } else {
      secondsRef.current = 0; // 모달이 닫힐 때 시간을 리셋합니다.
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 또는 모달 닫힐 때 인터벌 정리
  }, [showModal]);

  useEffect(() => {
    if (window.innerWidth < 500) {
      setMobile(true);
    } else {
      setMobile(false);
    }
    // 페이지 컴포넌트가 마운트될 때 body에 클래스 추가
    document.body.classList.add('ffdscroll');
    // 클린업 함수를 통해 페이지 컴포넌트가 언마운트될 때 클래스 제거
    return () => {
      document.body.classList.remove('ffdscroll');
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/audio/ffd.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
      />

      {showModal && (
        <FfdModal setShowModal={setShowModal} currTime={currTime} setRelayPlay={setRelayPlay} />
      )}
      {showCarousel && (
        <FfdCarousel setShowCarousel={setShowCarousel} mobile={mobile} imgs={imgs} />
      )}

      <div
        style={{
          height: '100vh',
          width: '100%',
          backgroundColor: 'rgb(0 0 0 / 78%)',
          position: 'fixed',
          zIndex: '10',
          display: redBtn ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.redbuttonbox}>
          <div className={styles.redbuttoninner}>
            <div className={styles.redbuttonglass}></div>
            <div className={styles.redbuttonout}>
              <div
                className={styles.redbutton}
                onClick={songStart}
                onTouchEnd={songStartTouch}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ffdpage} ref={gridRef}>
        <div className={styles.ffdbtnbottom}>
          <div></div>
          <Image
            onClick={scrollBottom}
            className={styles.ffdbtnimg}
            src="/assets/img/ffd_bottom.webp"
            alt="imgtobottom"
            width={16}
            height={16}
            unoptimized
          />
          <div className={styles.ffdvankobox}>
            <Link href={'/'} prefetch={false}>
              <Image
                className={styles.vankologo}
                src="/assets/img/ffd_vanko.webp"
                alt="vanko"
                width={32}
                height={32}
                unoptimized
              />
            </Link>
          </div>
        </div>

        <div className={styles.ffdgrid}>
          {imgs.map((img, i) => {
            return <FfdDrag img={img} key={i} />;
          })}
        </div>

        <div className={styles.ffdbtntop}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              className={styles.ffdtv}
              src="/assets/img/legotv2.webp"
              alt="tv"
              width={38}
              height={32}
              unoptimized
              onClick={handleTvClick}
            />
          </div>
          <Image
            onClick={scrollTop}
            className={styles.ffdbtnimg}
            src="/assets/img/ffd_top.webp"
            alt="imgtotop"
            width={16}
            height={16}
            unoptimized
          />
          <div className={styles.ffdvankobox}>
            <Image
              className={styles.lock}
              src="/assets/img/lock.webp"
              onClick={handleCarouselClick}
              alt="lock"
              width={32}
              height={32}
              unoptimized
            />
          </div>
        </div>
      </div>
    </>
  );
}
