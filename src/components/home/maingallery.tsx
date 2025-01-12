'use client';

import { Modal } from '@/components/common';
import { dunggeunmo, righteous } from '@/fonts';
import { useCurationsQuery } from '@/hooks/queries';
import styles from '@/styles/home.module.css';
import { Videos } from '@/types/vanko.type';
import cn from '@/utils/common/cn';
import Image from 'next/image';
import { useState } from 'react';

export default function MainGallery() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Videos | null>(null);

  const { data: curations } = useCurationsQuery();

  const openModal = (videos: Videos) => () => {
    setSelected(videos);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {selected && showModal && <Modal closeModal={closeModal} selected={selected} />}

      <div className={styles.maingallery}>
        {curations?.map((videos, i) => {
          const isKorean = /^[\u3131-\uD79D]+$/.test(videos.title as string);
          return (
            <div className={styles.gallerybox} key={i}>
              <div className={styles.imgbox}>
                <Image
                  className={styles.galleryimg}
                  onClick={openModal(videos)}
                  src={videos.thumb as string}
                  alt={videos.title as string}
                  fill
                  unoptimized
                />
              </div>
              <p
                className={cn(
                  `${styles.gallerytext} ${righteous.variable} ${dunggeunmo.variable}`,
                  {
                    'font-mixed': isKorean,
                  },
                )}
              >
                {videos.title}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
