import { getUserClient } from '@/apis/auth/get.api';
import { QUERY_KEY_USER } from '@/constants/query.constant';
import { Users } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export function useUserQuery() {
  return useQuery<Users | null>({
    queryKey: [QUERY_KEY_USER],
    queryFn: getUserClient,
  });
}
