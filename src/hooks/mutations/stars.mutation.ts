import { postStar, putStar } from '@/apis/projects/star/star.api';
import { QUERY_KEY_STAR, QUERY_KEY_STARS } from '@/constants/query.constant';
import { StarFromSupabase } from '@/types/projects.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useStarsMutation() {
  const queryClient = useQueryClient();
  return useMutation<StarFromSupabase, Error, StarFromSupabase>({
    mutationFn: (star) => postStar(star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
    },
  });
}

export function useEditStarsMutation() {
  const queryClient = useQueryClient();
  return useMutation<StarFromSupabase, Error, StarFromSupabase>({
    mutationFn: (star) => putStar(star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STAR] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STARS] });
    },
  });
}
