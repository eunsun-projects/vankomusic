'use client';

import Loading from '@/app/loading';
import { Suspense } from 'react';
import StarCanvas from './StarCanvas';
import StarDialog from './StarDialog';
import StarUI from './StarUI';

function StarTemplate() {
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
