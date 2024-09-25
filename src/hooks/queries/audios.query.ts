import { getAudios } from '@/apis/media/get.api';
import { QUERY_KEY_AUDIOS } from '@/constants/query.constant';
import { Audios } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export function useAudiosQuery() {
  return useQuery<Audios[]>({
    queryKey: [QUERY_KEY_AUDIOS],
    queryFn: getAudios,
  });
}
