'use client';

import styles from '@/styles/ffd.module.css';
import { useRef } from 'react';

interface FfdModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currTime: number;
  setRelayPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

function FfdModal({ setShowModal, currTime, setRelayPlay }: FfdModalProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  // 모달 끄기
  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== frameRef.current) {
      setShowModal(false);
      setRelayPlay(false);
    }
  };

  return (
    <div className={styles.modalcontainer} onClick={closeModal}>
      <div
        ref={frameRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <iframe
          className={styles.iframe}
          width="1120"
          height="630"
          src={`https://www.youtube.com/embed/HV1Bg7adKto?start=${Math.floor(currTime)}&autoplay=1&mute=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default FfdModal;
