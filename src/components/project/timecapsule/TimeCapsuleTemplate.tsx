'use client';

import Loading from '@/app/loading';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import TimeCapsuleUI from './TimeCapsuleUI';

const TimeCapsuleCanvas = dynamic(() => import('./TimeCapsuleCanvas'), {
  ssr: false,
});

function TimeCapsuleTemplate() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative w-full h-full">
        <TimeCapsuleUI />
        <TimeCapsuleCanvas />
      </div>
    </Suspense>
  );
}

export default TimeCapsuleTemplate;
