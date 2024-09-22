import { setWishs } from '@/apis/audios/set.api';
import { QUERY_KEY_WISHES } from '@/constants/query.constant';
import { Wishs } from '@/types/vanko.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useWishsMutation() {
  const queryClient = useQueryClient();
  return useMutation<Wishs[], Error, Wishs>({
    mutationFn: (wish: Wishs) => setWishs(wish),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_WISHES] });
    },
  });
}
