import { postUserServer } from '@/apis/auth/post.api';
import { getTimeCapsules } from '@/apis/projects/timecapsule/get.api';
import Loading from '@/app/loading';
import TimeCapsuleTemplate from '@/components/project/timecapsule/TimeCapsuleTemplate';
import { QUERY_KEY_TIME_CAPSULES, QUERY_KEY_USER } from '@/constants/query.constant';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { getUserFromHeaders } from '@/utils/common/getUserByHeaders';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

async function TimeCapsulePage() {
  const userId = getUserFromHeaders();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => postUserServer(userId),
  });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_TIME_CAPSULES],
    queryFn: () => getTimeCapsules(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <TimeCapsuleTemplate />
      </HydrationBoundary>
    </Suspense>
  );
}

export default TimeCapsulePage;
