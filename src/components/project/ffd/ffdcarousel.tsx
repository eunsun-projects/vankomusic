'use client';

import styles from '@/styles/ffd.module.css';
import '@/styles/react-carousel.es.css';
import Link from 'next/link';
import {
  ButtonFirst,
  ButtonLast,
  ButtonPlay,
  CarouselProvider,
  Image,
  Slide,
  Slider,
} from 'pure-react-carousel';
import { useRef } from 'react';
import FfdLoader from './ffdloader';

interface FfdCarouselProps {
  setShowCarousel: React.Dispatch<React.SetStateAction<boolean>>;
  mobile: boolean | null;
  imgs: string[];
}

export default function FfdCarousel({ setShowCarousel, mobile, imgs }: FfdCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const xRef = useRef<HTMLSpanElement | null>(null);

  const handleX = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === carouselRef.current || e.target === xRef.current) {
      setShowCarousel(false);
    }
  };

  return (
    <div
      ref={carouselRef}
      onClick={handleX}
      className={styles.modalcontain}
      style={{ zIndex: '1100', backgroundColor: '#000000ba' }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          color: 'white',
          fontSize: '1.5rem',
          fontFamily: 'DosGothic',
          cursor: 'pointer',
        }}
      >
        <span ref={xRef}>X</span>
      </div>
      <div className={styles.centerbox}>
        <div className={styles.centerdiv}>
          <div className={styles.modalp}>{`드래그 혹은 터치로 넘겨보실 수 있습니다.`}</div>
          <p style={{ textAlign: 'center', lineHeight: '2.5rem' }}>
            <Link
              href={'https://youtu.be/HV1Bg7adKto?si=0bGhQELJaAeF7HVE'}
              target="_blank"
              className={styles.modalp}
            >
              MV 보러가기
            </Link>
          </p>

          <div className={styles.carouselcontain} style={{ width: mobile ? '90%' : '70%' }}>
            <CarouselProvider
              naturalSlideHeight={8}
              naturalSlideWidth={8}
              totalSlides={imgs.length}
              hasMasterSpinner
              interval={1500}
            >
              <Slider spinner={() => <FfdLoader />}>
                {imgs.map((e, i) => {
                  return (
                    <Slide key={i} index={i}>
                      <Image
                        src={e}
                        hasMasterSpinner
                        alt="ffd-img"
                        style={{ width: '100%', height: '100%' }}
                      ></Image>
                    </Slide>
                  );
                })}
              </Slider>
              <div className={styles.btns}>
                <ButtonFirst className={styles.btn}>First</ButtonFirst>
                <ButtonPlay
                  className={styles.btn}
                  childrenPaused={'Play'}
                  childrenPlaying={'Pause'}
                ></ButtonPlay>
                <ButtonLast className={styles.btn}>Last</ButtonLast>
              </div>
            </CarouselProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
