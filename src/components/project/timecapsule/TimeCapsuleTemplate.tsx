'use client';

import Loading from '@/app/loading';
import { useTimeCapsulesQuery } from '@/hooks/queries/timecapsules.query';
import { useTimeCapsuleStore } from '@/stores/zustand';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import TimeCapsuleUI from './TimeCapsuleUI';

const TimeCapsuleCanvas = dynamic(() => import('./TimeCapsuleCanvas'), {
  ssr: false,
});

function TimeCapsuleTemplate() {
  const searchParams = useSearchParams();
  const queryStringTimeCapsuleId = searchParams.get('id');
  const { data: timeCapsulesFromSupabase, isPending, error } = useTimeCapsulesQuery();
  const { setTimeCapsulesWithoutObject, setQueryStringTimeCapsuleId } = useTimeCapsuleStore();

  useEffect(() => {
    if (!timeCapsulesFromSupabase) return;
    setTimeCapsulesWithoutObject(timeCapsulesFromSupabase);
  }, [timeCapsulesFromSupabase, setTimeCapsulesWithoutObject]);

  useEffect(() => {
    if (queryStringTimeCapsuleId) {
      setQueryStringTimeCapsuleId(queryStringTimeCapsuleId);
    }
  }, [queryStringTimeCapsuleId, setQueryStringTimeCapsuleId]);

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
