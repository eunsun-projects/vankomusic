import { getLogInWithProvider } from '@/apis/auth/get.api';
import { QUERY_KEY_USER } from '@/constants/query.constant';
import { OAuthResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

interface LogInQueryProps {
  provider: string;
  isStart: boolean;
}

export function useLogInQuery({ provider, isStart }: LogInQueryProps) {
  return useQuery<OAuthResponse['data']>({
    queryKey: [QUERY_KEY_USER],
    queryFn: () => getLogInWithProvider(provider),
    enabled: !!provider && isStart,
  });
}
