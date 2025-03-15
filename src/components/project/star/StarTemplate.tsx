'use client';

import Loading from '@/app/loading';
import { Suspense } from 'react';
import StarCanvas from './StarCanvas';
import StarDialog from './StarDialog';

function StarTemplate() {
  return (
    <Suspense fallback={<Loading />}>
      <StarDialog />
      <section className="flex items-center justify-center h-full w-full relative z-0">
        <StarCanvas />
      </section>
    </Suspense>
  );
}

export default StarTemplate;
