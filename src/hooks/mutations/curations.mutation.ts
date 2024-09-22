import { setCuration } from '@/apis/media/set.api';
import { QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCurationMutation() {
  const queryClient = useQueryClient();
  return useMutation<Videos[], Error, Videos[]>({
    mutationFn: (curations: Videos[]) => setCuration(curations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_VIDEOS] });
    },
  });
}
