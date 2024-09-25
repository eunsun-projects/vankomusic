'use client';
import styles from '@/styles/main.module.css';
import { Videos } from '@/types/vanko.type';
import { useMemo, useRef } from 'react';

interface ModalProps {
  closeModal: () => void;
  selected: Videos;
}

function Modal({ closeModal, selected }: ModalProps) {
  const youtubeRef = useRef<HTMLDivElement>(null);

  const id = useMemo(() => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = selected?.embed?.match(regex);
    const videoId = match ? match[1] : null;
    return videoId;
  }, [selected]);

  const checkAndClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== youtubeRef.current) closeModal();
  };

  return (
    <div onClick={checkAndClose} className={styles.modalcontainer}>
      <span className={styles.modalclose} onClick={closeModal}>
        X
      </span>
      <div
        ref={youtubeRef}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {id ? (
          <iframe
            className={styles.iframe}
            width="1120"
            height="630"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        ) : (
          <div>
            <p>No video selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
