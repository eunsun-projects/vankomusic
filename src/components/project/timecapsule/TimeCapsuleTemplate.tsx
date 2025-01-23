'use client';

import Loading from '@/app/loading';
import { useTimeCapsulesQuery } from '@/hooks/queries/timecapsules.query';
import { useTimeCapsuleStore } from '@/stores/zustand';
import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import TimeCapsuleUI from './TimeCapsuleUI';

const TimeCapsuleCanvas = dynamic(() => import('./TimeCapsuleCanvas'), {
  ssr: false,
});

function TimeCapsuleTemplate() {
  const { data: timeCapsules, isPending, error } = useTimeCapsulesQuery();
  const { setTimeCapsules } = useTimeCapsuleStore();

  useEffect(() => {
    if (timeCapsules) {
      setTimeCapsules(timeCapsules);
    }
  }, [timeCapsules, setTimeCapsules]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (isPending) return <Loading />;

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
