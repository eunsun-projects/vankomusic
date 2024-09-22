import { getVideos } from '@/apis/media/get.api';
import { QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export const useVideosQuery = () => {
  return useQuery<Videos[]>({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: getVideos,
  });
};
