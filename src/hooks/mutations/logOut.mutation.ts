import { deleteLogOut } from '@/apis/auth/delete.api';
import { QUERY_KEY_USER } from '@/constants/query.constant';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLogOutMutation() {
  const queryClient = useQueryClient();
  return useMutation<string, Error>({
    mutationFn: deleteLogOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_USER] });
    },
  });
}
