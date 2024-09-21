import styles from '@/styles/home.module.css';
import Image from 'next/image';

export default function BorderLine() {
  return (
    <div className={styles.borderbox}>
      <div className={styles.borderimgdiv} style={{ justifyContent: 'flex-end' }}>
        <Image
          src="/assets/img/pizza.webp"
          className={styles.borderimg}
          style={{ transform: 'scaleX(-1)' }}
          alt="pizza"
          unoptimized
        ></Image>
      </div>
      <div className={`${styles.line} ${styles.linetrans}`}></div>
      <div className={styles.borderimgdiv}>
        <Image
          src="/assets/img/pizza.webp"
          className={styles.borderimg}
          alt="pizza"
          unoptimized
        ></Image>
      </div>
    </div>
  );
}
