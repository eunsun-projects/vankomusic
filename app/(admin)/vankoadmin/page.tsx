import { postUserServer } from '@/apis/auth/post.api';
import { getAudios, getCurations, getVideos } from '@/apis/media/get.api';
import Loading from '@/app/loading';
import { AdminTemplate, IfMobile, LoginButton } from '@/components/admin';
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

  const user = await queryClient.fetchQuery({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => postUserServer(userId),
  });

  let isAdmin = null;
  if (
    user?.email === process.env.NEXT_PUBLIC_SCREEN_MAIL ||
    user?.email === process.env.NEXT_PUBLIC_VANKO_MAIL ||
    user?.email === process.env.NEXT_PUBLIC_EUNOH_MAIL
  )
    isAdmin = true;

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <IfMobile />
        {isAdmin ? <AdminTemplate /> : <LoginButton />}
      </HydrationBoundary>
    </Suspense>
  );
}
