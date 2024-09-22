import { getWishs } from '@/apis/media/get.api';
import { QUERY_KEY_WISHES } from '@/constants/query.constant';
import { Wishs } from '@/types/vanko.type';
import { useQuery } from '@tanstack/react-query';

export const useWishsQuery = () => {
  return useQuery<Wishs[]>({
    queryKey: [QUERY_KEY_WISHES],
    queryFn: getWishs,
  });
};
