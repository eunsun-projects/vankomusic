import {
  deleteTimeCapsule,
  editTimeCapsule,
  postTimeCapsule,
} from '@/apis/projects/timecapsule/set.api';
import { QUERY_KEY_TIME_CAPSULES } from '@/constants/query.constant';
import { TimeCapsule } from '@/types/projects.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useTimeCapsulesMutation() {
  const queryClient = useQueryClient();
  return useMutation<TimeCapsule, Error, Partial<TimeCapsule>>({
    mutationFn: (timeCapsule) => postTimeCapsule(timeCapsule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_TIME_CAPSULES] });
    },
  });
}

export function useEditTimeCapsulesMutation() {
  const queryClient = useQueryClient();
  return useMutation<TimeCapsule, Error, Partial<TimeCapsule>>({
    mutationFn: (timeCapsule) => editTimeCapsule(timeCapsule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_TIME_CAPSULES] });
    },
  });
}

export function useDeleteTimeCapsulesMutation() {
  const queryClient = useQueryClient();
  return useMutation<TimeCapsule, Error, Partial<TimeCapsule>>({
    mutationFn: (timeCapsule) => deleteTimeCapsule(timeCapsule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_TIME_CAPSULES] });
    },
  });
}
