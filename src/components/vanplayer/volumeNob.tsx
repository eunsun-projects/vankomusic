'use client';

import styles from '@/styles/vanplayer.module.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const VolumeControl = styled.div<{ $mobile: boolean; $volume: number; $speaker: boolean }>`
  display: none;
  display: ${(props: { $mobile: boolean }) => (props.$mobile ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  width: 6rem;

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    height: 100%;
    border-radius: 1rem;
    background: radial-gradient(lime, #0080c0, aliceblue);

    &:focus {
      outline: none;
    }

    //WEBKIT
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: ${(props: { $volume: number }) => (props.$volume > 0 ? 'aqua' : 'aqua')};
      margin-top: -3px;
      cursor: pointer;
    }

    &::-webkit-slider-runnable-track {
      height: 0.3rem;
      background: ${(props) =>
        props.$volume > 0
          ? `linear-gradient(to right, #88fd93 ${props.$volume}%, rgba(255, 255, 255, 0.1) ${props.$volume}% 100%)`
          : 'rgba(250,250,250,.3)'};
      border-radius: 3rem;
      transition: all 0.5s;
      cursor: pointer;
    }
  }
`;

interface VolumeNobProps {
  volume: number;
  setVolume: (volume: number) => void;
  mobile: boolean;
}

function VolumeNob({ volume, setVolume, mobile }: VolumeNobProps) {
  const [userSpeaker, setUserSpeaker] = useState(true);

  useEffect(() => {
    if (volume === 0) setUserSpeaker(false);
  }, [volume]);

  return (
    <div
      className={styles.volume_nob}
      style={{ display: mobile ? 'none' : 'flex', opacity: mobile ? '0' : '1' }}
    >
      <VolumeControl $volume={volume * 100} $speaker={userSpeaker} $mobile={mobile}>
        <input
          style={{ zIndex: '100' }}
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={volume}
          onChange={(event) => {
            setVolume(event.target.valueAsNumber);
          }}
        />
      </VolumeControl>
    </div>
  );
}
export default VolumeNob;
