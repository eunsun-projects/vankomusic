import { postUserServer } from '@/apis/auth/post.api';
import { getAudios, getCurations, getVideos } from '@/apis/media/get.api';
import Loading from '@/app/loading';
import { IfMobile } from '@/components/admin';
import AdminLoginSequence from '@/components/admin/adminloginsequence';
import {
  QUERY_KEY_AUDIOS,
  QUERY_KEY_CURATIONS,
  QUERY_KEY_USER,
  QUERY_KEY_VIDEOS,
} from '@/constants/query.constant';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { getUserFromHeaders } from '@/utils/common/getUserByHeaders';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default async function Vankoadmin() {
  const userId = getUserFromHeaders();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => postUserServer(userId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: () => getVideos(),
  });
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
        <IfMobile />
        <AdminLoginSequence />
      </HydrationBoundary>
    </Suspense>
  );
}
