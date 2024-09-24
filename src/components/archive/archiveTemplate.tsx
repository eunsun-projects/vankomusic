'use client';
import { Footer, Modal } from '@/components/common';
import { righteous } from '@/fonts';
import styles from '@/styles/archive.module.css';
import { Videos } from '@/types/vanko.type';
import Image from 'next/image';
import { useState } from 'react';

interface ArchiveProps {
  videos: Videos[];
}

export default function ArchiveTemplate({ videos }: ArchiveProps) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Videos | null>(null);

  const openModal = (videos: Videos) => () => {
    setSelected(videos);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {selected && showModal && <Modal closeModal={closeModal} selected={selected} />}

      <div className={styles.archivepage}>
        <div className={styles.archivetitle}>
          <Image
            className={`${styles.titleimg} ${styles.titleimgleft}`}
            src="/assets/img/cd.webp"
            alt="cd"
            width={40}
            height={40}
            unoptimized
          />
          <p>ARCHIVE</p>
          <Image
            className={`${styles.titleimg} ${styles.titleimgright}`}
            src="/assets/img/cd.webp"
            alt="cd"
            width={40}
            height={40}
            unoptimized
          />
        </div>

        <div className={styles.archivegrid}>
          {videos.map((video, i) => {
            return (
              <div
                className={`${styles.archivebox} ${righteous.className}`}
                style={{ fontFamily: 'DungGeunMo' }}
                key={i}
              >
                <div
                  className={styles.archiveimg}
                  onClick={openModal(video)}
                  style={{ backgroundImage: `url(${video.thumb})` }}
                ></div>
                <p>{video.title}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer color={'blue'} />
    </>
  );
}
