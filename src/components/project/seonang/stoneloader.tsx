'use client';

import styles from '@/styles/seonang.module.css';

export default function StoneLoader() {
  return (
    <div className={styles.loader}>
      <img className={styles.loaderimg} src="/assets/gifs/stone.gif" alt="stone" />
    </div>
  );
}
