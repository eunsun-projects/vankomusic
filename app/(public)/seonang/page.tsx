import { getWishs } from '@/apis/media/get.api';
import Loading from '@/app/loading';
import { SeonangTemplate } from '@/components/project/seonang';
import { QUERY_KEY_WISHES } from '@/constants/query.constant';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default async function SeonangPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_WISHES],
    queryFn: () => getWishs(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <SeonangTemplate />
      </HydrationBoundary>
    </Suspense>
  );
}
