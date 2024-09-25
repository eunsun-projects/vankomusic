import { setVideos } from '@/apis/media/set.api';
import { QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { PartialVideos, Videos } from '@/types/vanko.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useVideosMutation() {
  const queryClient = useQueryClient();
  return useMutation<Videos[], Error, { video: PartialVideos | Videos[]; mode: string }>({
    mutationFn: ({ video, mode }) => setVideos({ video, mode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_VIDEOS] });
    },
  });
}
