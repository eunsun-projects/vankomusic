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

export default function Archive({ videos }: ArchiveProps) {
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
            className={`${styles.titleImage} ${styles.titleImageleft}`}
            src="/assets/Image/cd.webp"
            alt="cd"
            unoptimized
          ></Image>
          <p>ARCHIVE</p>
          <Image
            className={`${styles.titleImage} ${styles.titleImageright}`}
            src="/assets/Image/cd.webp"
            alt="cd"
            unoptimized
          ></Image>
        </div>

        <div className={styles.archivegrid}>
          {videos.map((video, i) => {
            return (
              <div className={`${styles.archivebox} ${righteous.className}`} key={i}>
                <div
                  className={styles.archiveImage}
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
