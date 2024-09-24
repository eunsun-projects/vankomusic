import { Users } from '@/types/vanko.type';
import fetchWrapper from '@/utils/common/fetchWrapper';
import { OAuthResponse } from '@supabase/supabase-js';

export async function getLogInWithProvider(provider: string): Promise<OAuthResponse['data']> {
  const url = `/api/auth/provider?provider=${provider}`;
  const data = await fetchWrapper<OAuthResponse['data']>(url, {
    method: 'GET',
  });
  return data;
}

export async function getUserClient(): Promise<Users | null> {
  const url = `/api/auth/user`;

  const data = await fetchWrapper<Users>(url, {
    method: 'GET',
  });

  return data;
}
