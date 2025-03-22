'use client';

import Loading from '@/app/loading';
import { Suspense, useEffect } from 'react';
import StarCanvas from './StarCanvas';
import StarDialog from './StarDialog';
import StarUI from './StarUI';

function StarTemplate() {
  // 첫 접속시 로컬스토리지에 저장
  useEffect(() => {
    const isFirst = localStorage.getItem('isFirst');
    if (!isFirst) {
      localStorage.setItem('isFirst', JSON.stringify(false));
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <StarDialog />
      <StarUI />
      <section className="flex items-center justify-center h-full w-full relative z-0">
        <StarCanvas />
      </section>
    </Suspense>
  );
}

export default StarTemplate;
