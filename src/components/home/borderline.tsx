import styles from '@/styles/home.module.css';
import Image from 'next/image';

export default function BorderLine() {
  return (
    <div className={styles.borderbox}>
      <div className={styles.borderimgdiv} style={{ justifyContent: 'flex-end' }}>
        <Image
          src="/assets/img/pizza.webp"
          className={styles.borderimg}
          style={{ width: '3rem', height: 'auto', transform: 'scaleX(-1)' }}
          alt="pizza"
          width={48}
          height={48}
          unoptimized
        ></Image>
      </div>
      <div className={`${styles.line} ${styles.linetrans}`}></div>
      <div className={styles.borderimgdiv}>
        <Image
          src="/assets/img/pizza.webp"
          className={styles.borderimg}
          style={{ width: '3rem', height: 'auto' }}
          alt="pizza"
          width={40}
          height={48}
          unoptimized
        ></Image>
      </div>
    </div>
  );
}
