'use client';
import styles from '@/styles/seonang.module.css';
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
import { Dispatch, SetStateAction, useRef } from 'react';
import StoneLoader from './stoneloader';

function makeImgArr() {
  let imgarr = [];
  for (let i = 0; i < 126; i++) {
    let imgstring = `/assets/img/carousel/${i}.webp`;
    imgarr[i] = imgstring;
  }
  return imgarr;
}

interface MvModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function MvModal({ setShowModal }: MvModalProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const xRef = useRef<HTMLSpanElement | null>(null);

  const slideimgarr = makeImgArr();

  const handleX = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === carouselRef.current || e.target === xRef.current) {
      setShowModal(false);
    }
  };

  return (
    <div ref={carouselRef} onClick={handleX} className={styles.modalcontain}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          color: 'white',
          fontSize: '1.5rem',
          fontFamily: 'DosGothic',
        }}
      >
        <span ref={xRef}>X</span>
      </div>
      <div className={styles.centerbox}>
        <div className={styles.centerdiv}>
          <div
            className={styles.modalp}
          >{`서낭축원: 뮤직비디오 이미지 스크린샷\n드래그 혹은 터치로 넘겨보실 수 있습니다.`}</div>
          <p style={{ textAlign: 'center', lineHeight: '2.5rem' }}>
            <Link
              href={'https://youtu.be/L6Cqy26s9fI?si=o_tWF4Af0__wqfyh'}
              target="_blank"
              className={styles.modalp}
            >
              MV 보러가기
            </Link>
          </p>

          <div ref={carouselRef} className={styles.carouselcontain}>
            <CarouselProvider
              naturalSlideHeight={9}
              naturalSlideWidth={16}
              totalSlides={126}
              hasMasterSpinner
              interval={1500}
            >
              <Slider spinner={() => <StoneLoader />}>
                {slideimgarr.map((e, i) => {
                  return (
                    <Slide key={i} index={i}>
                      <Image src={e} hasMasterSpinner alt="mv" />
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
