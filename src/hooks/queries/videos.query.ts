import { getVideos } from '@/apis/audios/get.api';
import { QUERY_KEY_AUDIOS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export const useVideosQuery = () => {
  return useQuery<Videos[]>({
    queryKey: [QUERY_KEY_AUDIOS],
    queryFn: getVideos,
  });
};
