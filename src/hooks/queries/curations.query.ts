import { getCurations } from '@/apis/media/get.api';
import { QUERY_KEY_CURATIONS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export function useCurationsQuery() {
  return useQuery<Videos[]>({
    queryKey: [QUERY_KEY_CURATIONS],
    queryFn: getCurations,
  });
}
