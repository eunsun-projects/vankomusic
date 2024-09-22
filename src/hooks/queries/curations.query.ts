import { getVideos } from '@/apis/media/get.api';
import { QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export const useCurationsQuery = () => {
  return useQuery<Videos[]>({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: getVideos,
    select: (data) => data.filter((video) => video.isSelected),
  });
};
