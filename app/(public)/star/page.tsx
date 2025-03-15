import Loading from '@/app/loading';
import StarTemplate from '@/components/project/star/StarTemplate';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

function StarPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StarTemplate />
    </Suspense>
  );
}

export default StarPage;
