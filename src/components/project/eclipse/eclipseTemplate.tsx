'use client';

import { useState } from 'react';
import SinopVideo from './sinopvideo';

export default function EclipseTemplate() {
  const [start, setStart] = useState(false);

  const handleStart = () => {
    setStart(true);
  };

  return <>{start ? <SinopVideo /> : <div onClick={handleStart}>노래 시작 할것임?</div>}</>;
}
