import { orbitron } from '@/fonts';
import styles from '@/styles/main.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  color: string;
}

export default function Footer({ color }: FooterProps) {
  return (
    <div
      className={`${styles.footer} ${orbitron.className}`}
      style={{ borderTop: `1px solid ${color}` }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className={styles.footerimg}>
          <Image
            style={{ width: '1.2rem', height: '1.2rem' }}
            src="/assets/img/footer_vanko.webp"
            alt="vanko"
            unoptimized
          ></Image>
          <p>home</p>
        </div>
      </Link>
      <p>ⓒ2024.vankomusic.</p>
    </div>
  );
}
