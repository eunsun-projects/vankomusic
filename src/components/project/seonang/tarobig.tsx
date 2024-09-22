import styles from '@/styles/seonang.module.css';
import Image from 'next/image';
import { useRef } from 'react';

async function fetchImageAsFile(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], 'fortune_img_by-AI.png', { type: blob.type });
  } catch (error) {
    console.error('이미지를 불러오는 데 실패했습니다:', error);
    return null;
  }
}

interface TaroBigProps {
  closeTaroBig: () => void;
  pngWebp: string | null;
  mobile: boolean;
  android: boolean;
}

export default function TaroBig({ closeTaroBig, pngWebp, mobile, android }: TaroBigProps) {
  const bigTaroImgRef = useRef<HTMLImageElement | null>(null);
  const bigTaroDownRef = useRef<HTMLParagraphElement | null>(null);
  const bigTaroDownTwoRef = useRef<HTMLParagraphElement | null>(null);

  const clickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target !== bigTaroImgRef.current &&
      e.target !== bigTaroDownRef.current &&
      e.target !== bigTaroDownTwoRef.current
    ) {
      closeTaroBig();
    }
  };

  const shareImageFile = async (imageUrl: string) => {
    const imageFile = await fetchImageAsFile(imageUrl);
    if (!imageFile) return;
    if (window.navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try {
        await window.navigator.share({
          files: [imageFile],
          title: '서낭신의 응답',
        });
        console.log('이미지 파일이 공유되었습니다.');
      } catch (error) {
        console.error('파일 공유에 실패했습니다:', error);
      }
    } else {
      console.log('이 브라우저는 파일 공유를 지원하지 않습니다.');
    }
  };

  return (
    <div className={styles.bigtarocontainer} onClick={clickOutside}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span className={styles.close} onClick={closeTaroBig}>
          X
        </span>
      </div>

      <div className={styles.bigtarocenter}>
        <div className={styles.bigtarobox}>
          <Image
            ref={bigTaroImgRef}
            className={styles.bigtaroimg}
            src={`${pngWebp}.webp`}
            unoptimized
            alt="bigtaro"
          ></Image>
        </div>
        <div>
          {mobile && android === false ? (
            <div style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
              <p
                style={{ backgroundColor: '#5d3c37' }}
                onClick={() => shareImageFile(`${pngWebp}.png`)}
                className={styles.download}
                ref={bigTaroDownRef}
              >
                download
              </p>
            </div>
          ) : (
            <a
              href={`${pngWebp}.png`}
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <p ref={bigTaroDownTwoRef} className={styles.download}>
                download
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
