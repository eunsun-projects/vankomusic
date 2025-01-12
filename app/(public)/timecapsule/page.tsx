import Loading from '@/app/loading';
import TimeCapsuleTemplate from '@/components/project/timecapsule/TimeCapsuleTemplate';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

function TimeCapsulePage() {
  return (
    <Suspense fallback={<Loading />}>
      <TimeCapsuleTemplate />
    </Suspense>
  );
}

export default TimeCapsulePage;
