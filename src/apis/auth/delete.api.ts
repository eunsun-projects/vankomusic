import fetchWrapper from '@/utils/common/fetchWrapper';

export async function deleteLogOut(): Promise<string> {
  const url = `/api/auth/user`;
  const data = await fetchWrapper<string>(url, {
    method: 'DELETE',
  });
  return data;
}
