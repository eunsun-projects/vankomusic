'use client';
import styles from '@/app/home/page.module.css';
import Modal from '@/components/elements/modal';
import { righteous } from '@/fonts';
import { Videos } from '@/types/vanko.type';
import Image from 'next/image';
import { useState } from 'react';

interface MainGalleryProps {
  selectedVideos: Videos[];
}

export default function MainGallery({ selectedVideos }: MainGalleryProps) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Videos | null>(null);

  const openModal = (videos: Videos) => () => {
    setSelected(videos);
    setShowModal(true);
  };

  return (
    <>
      {selected && showModal && <Modal setShowModal={setShowModal} modalPack={selected} />}

      <div className={styles.maingallery}>
        {selectedVideos.map((videos, i) => {
          return (
            <div className={styles.gallerybox} key={i}>
              <div className={styles.imgbox}>
                <Image
                  className={styles.galleryimg}
                  onClick={openModal(videos)}
                  src={videos.thumb as string}
                  alt={videos.title as string}
                  unoptimized
                ></Image>
              </div>
              <p className={`${styles.gallerytext} ${righteous.className}`}>{videos.title}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
