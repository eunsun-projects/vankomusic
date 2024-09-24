'use client';

import Landscape from '@/components/common/ifLandscape';
import MmLoader from '@/components/common/loaders/mmloader';
import styles from '@/styles/modern-move.module.css';
import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';

import { VaporScene } from '@/components/project/modernmove';
import MoonLoaderBlack from '@/components/project/modernmove/loaders/moonloaderblack';
import { useRouter } from 'next/navigation';

export default function ModernMoveTemplate() {
  const [innerW, setInnerW] = useState<number | null>(null);
  const [play, setPlay] = useState(false); // 오디오 플레이어의 재생 여부를 나타내는 상태 값이다.
  const [threeD, setThreeD] = useState(true);
  const [awaiting, setAwaiting] = useState(true);
  const [ending, setEnding] = useState(false);
  const [meteor, setMeteor] = useState(false);
  const [objet, setObjet] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const monitorRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const handlePlayClick = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.muted = false;
    audioRef.current
      .play()
      .then(() => {
        setPlay(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMeteorClick = () => {
    setMeteor(true);
    const timer = setTimeout(() => {
      setMeteor(false);
      clearTimeout(timer);
    }, 2000);
  };

  const handleObjetClick = () => {
    if (play) {
      setObjet(true);
      const timer = setTimeout(() => {
        setObjet(false);
        clearTimeout(timer);
      }, 2500);
    }
  };

  const handlePauseClick = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlay(false);
  };

  const handleStopClick = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlay(false);
  };

  const handleThreeDClick = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.muted = false;
    audioRef.current
      .play()
      .then(() => {
        setPlay(true);
      })
      .catch((err) => {
        console.log(err);
      });
    setThreeD(!threeD);
  };

  const handleHomeClick = () => router.push('/');

  const handleEnding = () => {
    console.log('ended!');
    const timer = setTimeout(() => {
      setEnding(true);
      clearTimeout(timer);
    }, 3000);
  };

  useEffect(() => {
    /** ============ set screensize =============== */
    const setScreenSize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 뒤로가기 버튼을 감지하기 위한 핸들러 함수
    const handlePopState = () => router.refresh(); // 현재 페이지 새로고침

    if (typeof window === 'object' && typeof document !== undefined) {
      setInnerW(window.innerWidth);

      const timeout = setTimeout(() => {
        setAwaiting(false);
        clearTimeout(timeout);
      }, 1000);

      /** ====== Generate a resize event if the device doesn't do it ====== */
      window.addEventListener(
        'orientationchange',
        () => window.dispatchEvent(new Event('resize')),
        false,
      );
      window.addEventListener('resize', setScreenSize);
      window.dispatchEvent(new Event('resize'));
      // popstate 이벤트 리스너 추가
      window.addEventListener('popstate', handlePopState);
    }
    return () => {
      window.removeEventListener(
        'orientationchange',
        () => window.dispatchEvent(new Event('resize')),
        false,
      );
      window.removeEventListener('resize', setScreenSize);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/audio/modernmove.mp3"
        preload="metadata"
        muted
        onEnded={handleEnding}
      />
      <Suspense fallback={<MoonLoaderBlack />}>
        <div ref={monitorRef} className={styles.monitortop}>
          <Landscape />

          <div className={styles.monitorbox}>
            <div className={styles.monitortopvoid}></div>

            <div className={styles.monitorcanvasbox}>
              {innerW && !ending ? (
                <VaporScene
                  audio={audioRef.current as HTMLAudioElement}
                  play={play}
                  threeD={threeD}
                  meteor={meteor}
                  objet={objet}
                />
              ) : (
                <div className={styles.mmloader}>
                  <MmLoader />
                </div>
              )}
            </div>

            <div className={styles.monitorbottombox}>
              <div className={styles.monitorhomebox}>
                <div id="voidhomebtn" className={styles.monitorhomeboxinner}>
                  {!objet ? (
                    <img
                      className={styles.homebtnvankoimg}
                      src="/assets/img/gamegi_vanko.webp"
                      alt="vanko01"
                      onClick={handleObjetClick}
                    />
                  ) : (
                    <img
                      className={styles.homebtnvankoimg}
                      src="/assets/img/gamegi_vankowow.webp"
                      alt="vanko02"
                    />
                  )}
                  <img
                    className={styles.homebtnbackimg}
                    src="/assets/img/gamegibtn-big.webp"
                    alt="gamegi_home_box"
                  />
                </div>
              </div>

              <div className={styles.monitorbottombtngrid}>
                <div style={{ display: 'grid' }}>
                  {!play ? (
                    <img
                      id="play"
                      className={styles.gamegibtn}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        pointerEvents: awaiting ? 'none' : 'all',
                      }}
                      src="/assets/img/gamegi-playbtn.webp"
                      alt="gamegi_play"
                      onClick={handlePlayClick}
                    />
                  ) : (
                    <img
                      id="pause"
                      className={styles.gamegibtn}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                      }}
                      src="/assets/img/gamegi-pausebtn.webp"
                      alt="gamegi_pause"
                      onClick={handlePauseClick}
                    />
                  )}
                </div>
                <div style={{ display: 'grid' }}>
                  {!meteor ? (
                    <img
                      id="star"
                      className={styles.gamegibtntop}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                        pointerEvents: awaiting ? 'none' : 'all',
                      }}
                      src="/assets/img/gamegi-starbtn.webp"
                      alt="gamegi_star"
                      onClick={handleMeteorClick}
                    />
                  ) : (
                    <img
                      className={styles.gamegibtntop}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                      }}
                      src="/assets/img/gamegi-transstarbtn.webp"
                      alt="gamegi_star"
                    />
                  )}
                </div>
                <div style={{ display: 'grid' }}>
                  <img
                    id="threed"
                    className={styles.gamegibtn}
                    style={{
                      position: 'relative',
                      height: 'auto',
                      zIndex: '6',
                      boxSizing: 'border-box',
                      pointerEvents: awaiting ? 'none' : 'all',
                    }}
                    src="/assets/img/gamegi-homebtn.webp"
                    alt="gamegi_home"
                    onClick={handleHomeClick}
                  />
                </div>
                <div style={{ display: 'grid' }}>
                  {threeD ? (
                    <img
                      id="threed"
                      className={styles.gamegibtntop}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                        pointerEvents: awaiting ? 'none' : 'all',
                      }}
                      src="/assets/img/gamegi-3dbtn.webp"
                      alt="gamegi_3d"
                      onClick={handleThreeDClick}
                    />
                  ) : (
                    <img
                      className={styles.gamegibtntop}
                      style={{
                        position: 'relative',
                        height: 'auto',
                        zIndex: '6',
                        boxSizing: 'border-box',
                      }}
                      src="/assets/img/gamegi-2dbtn.webp"
                      alt="gamegi_2d"
                      onClick={handleThreeDClick}
                    />
                  )}
                </div>

                <div></div>
                <div></div>
              </div>
            </div>

            <Image
              style={{ pointerEvents: 'none' }}
              src={'/assets/img/newgamegibody.webp'}
              alt="gamegi"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1600px) 36rem, (max-width: 1920px) 36rem, 36rem"
            />
          </div>

          <div
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              position: 'relative',
              zIndex: '0',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundSize: '20rem',
                backgroundRepeat: 'repeat',
                backgroundImage: 'url(/assets/img/modernback.png)',
              }}
            ></div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
