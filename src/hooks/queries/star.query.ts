import { getStars, postStar, putStar } from '@/apis/projects/star/star.api';
import { QUERY_KEY_STAR } from '@/constants/query.constant';
import { StarFromSupabase } from '@/types/projects.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useStarQuery(email: string) {
  return useQuery<StarFromSupabase[]>({
    queryKey: [QUERY_KEY_STAR],
    queryFn: () => getStars(email),
    enabled: !!email,
  });
}

export function usePostStarMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (star: StarFromSupabase) => postStar(star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
    },
  });
}

export function usePutStarMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (star: StarFromSupabase) => putStar(star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
    },
  });
}
