import styles from '@/styles/main.module.css';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className={styles.loader}>
      <Image
        className={styles.loaderimg}
        src="/assets/img/192vanko.png"
        alt="vanko"
        width={80}
        height={80}
        unoptimized
      ></Image>
    </div>
  );
}
