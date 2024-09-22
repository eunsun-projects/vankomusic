'use client';
import styles from '@/styles/seonang.module.css';
import Image from 'next/image';

export default function StoneLoader() {
  return (
    <div className={styles.loader}>
      <Image
        className={styles.loaderimg}
        src="/assets/gifs/stone.gif"
        alt="stone"
        unoptimized
      ></Image>
    </div>
  );
}
