import { Users } from '@/types/vanko.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function postUserServer(userId: string | null): Promise<Users | null> {
  if (!userId) return null;
  const url = `/api/auth/user`;
  try {
    const data = await fetchWrapper<Users | null>(url, {
      method: 'POST',
      body: JSON.stringify({ userId }),
      cache: 'no-store',
    });
    return data;
  } catch (error: any) {
    if (error.message === 'Auth session missing!') {
      return null;
    }
    throw error;
  }
}
