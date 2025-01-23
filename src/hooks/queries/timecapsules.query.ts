import { getTimeCapsules } from '@/apis/projects/timecapsule/get.api';
import { QUERY_KEY_TIME_CAPSULES } from '@/constants/query.constant';
import { TimeCapsule } from '@/types/projects.type';
import { useQuery } from '@tanstack/react-query';

export function useTimeCapsulesQuery() {
  return useQuery<TimeCapsule[]>({
    queryKey: [QUERY_KEY_TIME_CAPSULES],
    queryFn: getTimeCapsules,
  });
}
