import Loading from '@/app/loading';
import { ModernMoveTemplate } from '@/components/project/modernmove';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default function ModernMovePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ModernMoveTemplate />
    </Suspense>
  );
}
