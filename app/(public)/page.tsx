import { getAudios, getCurations } from '@/apis/media/get.api';
import HomeTemplate from '@/components/home/HomeTemplate';
import { QUERY_KEY_AUDIOS, QUERY_KEY_CURATIONS } from '@/constants/query.constant';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import Loading from '../loading';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_AUDIOS],
    queryFn: () => getAudios(),
  });
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_CURATIONS],
    queryFn: () => getCurations(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <HomeTemplate />
      </HydrationBoundary>
    </Suspense>
  );
}
