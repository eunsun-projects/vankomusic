'use client';
import styles from '@/styles/ffd.module.css';
import Image from 'next/image';

export default function FfdLoader() {
  return (
    <div className={styles.loader}>
      <Image
        className={styles.loaderimg}
        src="/assets/img/ffd_vanko.webp"
        alt="vankologo"
        width={160}
        height={160}
        unoptimized
      ></Image>
    </div>
  );
}
