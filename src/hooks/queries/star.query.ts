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
    mutationFn: ({ email, star }: { email: string; star: StarFromSupabase }) =>
      postStar(email, star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
    },
  });
}

export function usePutStarMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, star }: { email: string; star: StarFromSupabase }) =>
      putStar(email, star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
    },
  });
}
