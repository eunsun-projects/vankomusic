import { getStar, getStars } from '@/apis/projects/star/star.api';
import { QUERY_KEY_STAR, QUERY_KEY_STARS } from '@/constants/query.constant';
import { StarFromSupabase } from '@/types/projects.type';
import { useQuery } from '@tanstack/react-query';

export function useStarQuery(email: string | null) {
  return useQuery<StarFromSupabase | { message: string } | null>({
    queryKey: [QUERY_KEY_STAR],
    queryFn: () => getStar(email),
    enabled: !!email,
  });
}

export function useStarsQuery() {
  return useQuery<StarFromSupabase[] | null>({
    queryKey: [QUERY_KEY_STARS],
    queryFn: () => getStars(),
  });
}
