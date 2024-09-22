import { ErrorResponse, Users } from '@/types/vanko.type';
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
  try {
    const data = await fetchWrapper<Users | ErrorResponse>(url, {
      method: 'GET',
    });
    if ('error' in data) {
      if (data.error === 'Auth session missing!') {
        return null;
      }
      return null;
    }
    return data;
  } catch (error: any) {
    if (error.message === 'Auth session missing!') {
      return null;
    }
    throw error;
  }
}
