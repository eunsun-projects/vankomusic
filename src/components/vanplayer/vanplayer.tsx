'use client';
import { silkscreen } from '@/fonts';
import { Audios } from '@/types/vanko.type';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import VolumeNob from './volumeNob.js';

interface VanPlayerProps {
  bgmsList: Audios[];
}

export default function VanPlayer({ bgmsList }: VanPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null); // 오디오 객체 ref 생성
  const [play, setPlay] = useState(false);
  const [load, setLoad] = useState(false); // 기본 로딩 완료되면 true
  const [src, setSrc] = useState(bgmsList[0]); // src 초기값 bgmsList 의 0번으로 설정
  const [full, setFull] = useState(0); //플레이타임 전체 백분율 측정용
  const [maxM, setMaxM] = useState(0); //곡 전체 재생시간
  const [current, setCurrent] = useState(0); //플레이타임 현재 백분율
  const [nowM, setNowM] = useState(0); //현재재생시간
  const [listOpen, setListOpen] = useState(false); //목록 열렸냐 닫혔냐
  const [volume, setVolume] = useState(0.5); //기본 볼륨값
  const [nob, setNob] = useState(false); //볼륨노브
  const [mute, setMute] = useState(false); //음소거 컨트롤
  const [fullyLoad, setFullyLoad] = useState(false); // oncanplaythrough 완료 여부
  const [mobile, setMobile] = useState<boolean | null>(null); // 모바일 체커

  const volume_mute = 'volume_mute';
  const volume_off = 'volume_off';

  // 메타데이터로드 완료시 호출
  const handleLoad = () => {
    setLoad(true);
    if (play && audioRef.current) audioRef.current.play(); // 만약 곡이 넘어갔을 때, 연속재생 중이면(가능이면) 재생해라
  };

  // 재생 클릭시 플레이
  const handlePlay = () => {
    if (audioRef.current) audioRef.current.play();
    setPlay(true);
  };

  // 일시정지 호출 되었을때!
  const handlePause = () => {
    if (play) {
      return;
    } else {
      if (audioRef.current) audioRef.current.pause();
      setPlay(false);
    }
  };

  // 일시정지 클릭시 포즈
  const handlePauseClick = () => {
    if (audioRef.current) audioRef.current.pause();
    setPlay(false);
  };

  // 음원 종료시 호출
  const handleEnded = () => {
    const result = bgmsList.filter((e, i) => {
      if (!audioRef.current) return;
      if (Number(audioRef.current.dataset.num) === bgmsList.length - 1) {
        // 재생종료시 마지막리스트이면
        return setPlay(false); // 플레이스테이트 false
      } else {
        return i === Number(audioRef.current.dataset.num) + 1; // 마지막리스트가 아니면 인덱스 +1 해서 객체 리턴
      }
    });
    result.length > 0 && setSrc(result[0]); // 리턴받은 값이 있으면, src 스테이트로 설정
  };

  const handleListOpen = () => {
    setListOpen(!listOpen);
  };

  // 플레이타임 맥스 설정
  const handleDuration = () => {
    if (!audioRef.current) return;
    const max = dayjs(audioRef.current.duration * 1000).format('mm:ss');
    setMaxM(Number(max));
    setFull(audioRef.current.duration);
  };

  // 플레이타임 진행중 설정
  const handleCurrent = () => {
    if (!audioRef.current) return;
    const now = dayjs(audioRef.current.currentTime * 1000).format('mm:ss');
    setNowM(Number(now));
    setCurrent(audioRef.current.currentTime);
  };

  // 음원 로딩 완료시(onCanPlayThrough) 호출
  const handleFullyloaded = () => {
    console.log('fully loaded !');
    // audioRef.current.play(); 자동 재생 금지 !!
    // setPlay(true);
    setFullyLoad(true);
  };

  // 재생목록에서 선택시 audioPromise 사용하여 연속재생, 오류시에도 강제 연속재생
  const handleListClick = (item: Audios) => () => {
    setSrc(item);
    setPlay(true);
    if (!audioRef.current) return;
    const audioPromise = audioRef.current.play();
    if (audioPromise !== undefined) {
      audioPromise
        .then(() => {
          if (audioRef.current) audioRef.current.play();
        })
        .catch((err) => {
          console.log(err);
          if (audioRef.current) audioRef.current.play();
        });
    }
  };

  // 이전버튼 클릭시 호출
  const handleBefore = () => {
    const result = bgmsList.filter((e, i) => {
      if (!audioRef.current) return;
      if (Number(audioRef.current.dataset.num) === 0) {
        // 재생목록 인덱스 0 이면 그냥 리턴
        return;
      } else {
        return i === Number(audioRef.current.dataset.num) - 1; // 재생목록 인덱스 0 이 아니면 -1 하여 객체 리턴
      }
    });
    result.length > 0 && setSrc(result[0]);
    setPlay(true);
  };

  // 다음버튼 클릭시 호출, 내용은 이전버튼 클릭의 반대임
  const handleNext = () => {
    const result = bgmsList.filter((e, i) => {
      if (!audioRef.current) return;
      if (Number(audioRef.current.dataset.num) === bgmsList.length - 1) {
        return; //마지막 곡에서 다음버튼 클릭하면 다시 0번으로..추가하기..
      } else {
        return i === Number(audioRef.current.dataset.num) + 1;
      }
    });
    result.length > 0 && setSrc(result[0]);
    setPlay(true);
  };

  // 현재 곡 리플레이시 호출
  const handleRewind = () => {
    if (!audioRef.current) return;
    audioRef.current.load(); // 현재 곡 리로드
    audioRef.current.play(); // 현재 곡 재생
    setPlay(true);
  };

  // 프로그레스 바 작동 함수
  const handleProgress = (e: React.MouseEvent<HTMLProgressElement>) => {
    if (!audioRef.current) return;
    const width = e.currentTarget.clientWidth; // 전체 넓이
    const offsetX = e.nativeEvent.offsetX; // 현재 x 좌표;
    const duration = audioRef.current.duration; // 재생길이
    audioRef.current.currentTime = (offsetX / width) * duration;
  };

  // 볼륨 노브 진입시 호출, 모바일인 경우 뮤트 컨트롤 아닌 경우 볼륨노브 노출
  const handleNob = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) {
      if (e.type === 'click') {
        if (!audioRef.current) return;
        audioRef.current.muted = !mute;
        setMute(!mute);
      }
    } else {
      if (e.type === 'mouseenter') {
        setNob(true);
      } else if (e.type === 'mouseleave') {
        setNob(false);
      }
      if (e.type === 'click') {
        setNob(!nob);
      }
    }
  };

  // 볼륨 노브 진입시 호출 2, 모바일인 경우 뮤트 컨트롤
  const handleNob2 = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (window.innerWidth < 768) {
      if (e.type === 'click') {
        if (!audioRef.current) return;
        audioRef.current.muted = !mute;
        setMute(!mute);
      }
    }
  };

  // src 가 바뀔 때마다 로딩 중 상태 설정
  useEffect(() => {
    if (src && audioRef.current) {
      if (src.number === 0) {
        console.log('반오디오 최초');
        // if(!play) audioRef.current.load(); // 여기서 했더니 0번 곡일 때 일시정지해도 다시 첨부터 로드되서 onmount useEffect 로 옮겨버림
        // setLoad(true);
      } else if (audioRef.current.src === src.url) {
        // 이전 곡src 와 src 스테이트가 일치하면 === 잘 넘어갔으면
        console.log('반오디오 다음곡');
        if (play) audioRef.current.play();
        setLoad(true); // 다음 곡 (선택된 곡) 로딩이 완료되었다는 뜻
      } else {
        console.log('반오디오 똑같음');
        setLoad(false);
      }
    }
  }, [src, play]);

  // 볼륨 노브 컴포넌트로 전체 볼륨 컨트롤 하기 위해 audio 객체 볼륨 초기값 = 0.5 할당
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // 사파리는 따로 또 추가해줘야 하네요 ㅜㅜ
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    if (isMobile) setMobile(true);

    if (audioRef.current) audioRef.current.load();
    setLoad(true);
  }, []);

  return (
    <>
      <div className={styles.vanradio}>
        <div className={`${styles.music_container} ${play && 'play'}`}>
          <VanAmpBtn />
          <audio
            id="audio"
            preload="metadata"
            // autoPlay
            // muted
            data-name={src.title}
            data-num={src.number}
            ref={audioRef}
            src={src.url as string}
            onLoadedData={handleLoad}
            onCanPlayThrough={handleFullyloaded}
            onDurationChange={handleDuration}
            onTimeUpdate={handleCurrent}
            onPause={handlePause}
            onPlay={handlePlay}
            onEnded={handleEnded}
          >
            Your browser does not support the <code>audio</code> element.
          </audio>
          <div className={styles.nav_wrapper}>
            <div className={styles.nav_lower_container}>
              <span className={`${styles.music_time} ${silkscreen.className}`}>
                {nowM} / {maxM}
              </span>
              {src && (
                <span className={`${styles.music_title} ${silkscreen.className}`}>{src.title}</span>
              )}
              <span
                className={`${styles.material_symbols_outlined} ${styles.list}`}
                onClick={handleListOpen}
              >
                list
              </span>
            </div>

            <div className={styles.nav_upper_container}>
              <div style={{ width: '98%', display: 'flex' }}>
                <div className={styles.progress_container} id="progress-container">
                  <progress
                    id="progress"
                    className={styles.progress}
                    value={current}
                    max={full}
                    onClick={handleProgress}
                  ></progress>
                </div>
              </div>

              <div className={styles.navigation_upper}>
                <span
                  className={`${styles.material_symbols_outlined} ${styles.fast_btn}`}
                  style={{ pointerEvents: load ? 'auto' : 'none' }}
                  onClick={handleBefore}
                >
                  fast_rewind
                </span>
                {play === false ? (
                  <span
                    className={`${styles.material_symbols_outlined} ${styles.play_btn}`}
                    style={{ pointerEvents: load ? 'auto' : 'none' }}
                    onClick={handlePlay}
                  >
                    play_arrow
                  </span>
                ) : (
                  <span
                    className={`${styles.material_symbols_outlined} ${styles.pause_btn}`}
                    style={{
                      pointerEvents: load ? 'auto' : 'none',
                      textShadow: '0px 0px 5px aqua, 0px 0px 5px aqua, 0px 0px 5px aqua',
                    }}
                    onClick={handlePauseClick}
                  >
                    pause
                  </span>
                )}
                <span
                  className={`${styles.material_symbols_outlined} ${styles.fast_btn}`}
                  style={{ pointerEvents: load ? 'auto' : 'none' }}
                  onClick={handleNext}
                >
                  fast_forward
                </span>
                <span
                  className={`${styles.material_symbols_outlined} ${styles.replay_btn}`}
                  style={{ pointerEvents: load ? 'auto' : 'none' }}
                  onClick={handleRewind}
                >
                  replay
                </span>

                <div
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  onMouseEnter={handleNob}
                  onMouseLeave={handleNob}
                >
                  {volume > 0 && mute === false ? (
                    <span
                      className={`${styles.material_symbols_outlined} ${styles.volume}`}
                      onClick={handleNob}
                    >
                      volume_up
                    </span>
                  ) : (
                    <span
                      style={{
                        left: '0px',
                        textShadow: mute
                          ? '0px 0px 5px aqua, 0px 0px 5px aqua, 0px 0px 5px aqua'
                          : 'none',
                      }}
                      className={styles.material_symbols_outlined}
                      onClick={handleNob2}
                    >
                      {mute ? volume_off : volume_mute}
                    </span>
                  )}
                  <VolumeNob volume={volume} setVolume={setVolume} mobile={mobile ?? false} />
                </div>
              </div>
            </div>
          </div>

          {listOpen && (
            <div className={styles.music_info}>
              {bgmsList.length > 0 &&
                bgmsList.map((item, index) => (
                  <div key={(item.title as string) + index}>
                    <p
                      style={{
                        color: src.number === index ? 'aqua' : 'lightblue',
                        pointerEvents: load ? 'auto' : 'none',
                        fontFamily: 'auto',
                      }}
                      onClick={handleListClick(item)}
                    >
                      {item.title}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function VanAmpBtn() {
  return (
    <div className={styles.vanampboxex}>
      <div className={styles.vancircleleft}></div>
      <div className={styles.vanampbox}>
        <div className={styles.vanampbtn}>VAN AMP</div>
      </div>
      <div className={styles.vancircleright}></div>
    </div>
  );
}
