import { getVideos } from '@/apis/media/get.api';
import ArchiveTemplate from '@/components/archive/archiveTemplate';
import { QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { Videos } from '@/types/vanko.type';
import { QueryClient } from '@tanstack/react-query';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default async function ArchivePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: () => getVideos(),
  });

  const videos = await queryClient.ensureQueryData<Videos[]>({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: () => getVideos(),
  });

  return <ArchiveTemplate videos={videos} />;
}
