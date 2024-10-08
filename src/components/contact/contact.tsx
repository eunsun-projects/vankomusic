import { Footer } from '@/components/common';
import styles from '@/styles/contact.module.css';
import Image from 'next/image';
import EmailForm from './emailform';

export default function ContactTemplate() {
  return (
    <>
      <div className={styles.contactpage}>
        <div className={styles.contacttitle}>
          <Image
            className={`${styles.contitleimg} ${styles.contitleimgl}`}
            src="/assets/img/email.webp"
            alt="email"
            unoptimized
            width={48}
            height={48}
          />
          <p>CONTACT</p>
          <Image
            className={`${styles.contitleimg} ${styles.contitleimgr}`}
            src="/assets/img/email.webp"
            alt="email"
            unoptimized
            width={48}
            height={48}
          />
        </div>
        <div className={styles.contacttextbox}>
          <div className={styles.contactpdf}>
            <p>ミ✩ 작업의뢰 환영 ミ✩</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src="/assets/gifs/contact_vanko.gif"
              className={styles.convanko}
              alt="contact_vanko"
              unoptimized
              width={56}
              height={56}
            />
          </div>
          <EmailForm />
        </div>
      </div>
      <Footer color={'purple'} />
    </>
  );
}
