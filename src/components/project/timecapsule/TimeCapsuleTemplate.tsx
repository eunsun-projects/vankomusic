'use client';

import dynamic from 'next/dynamic';

const TimeCapsuleCanvas = dynamic(() => import('./TimeCapsuleCanvas'), {
  ssr: false,
});

function TimeCapsuleTemplate() {
  return <TimeCapsuleCanvas />;
}

export default TimeCapsuleTemplate;
