import { setAudios } from '@/apis/media/set.api';
import { QUERY_KEY_AUDIOS } from '@/constants/query.constant';
import { Audios } from '@/types/vanko.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AudiosMutationProps {
  audios: Audios[] | null;
  files: FormData | null;
  mode: string;
}

export function useAudiosMutation() {
  const queryClient = useQueryClient();
  return useMutation<Audios[], Error, AudiosMutationProps>({
    mutationFn: ({ audios, files, mode }) => setAudios({ audios, files, mode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_AUDIOS] });
    },
  });
}
