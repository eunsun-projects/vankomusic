import { Wishs } from '@/types/vanko.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function setWishs(wish: Wishs) {
  const url = '/api/set/wishs';
  const data = await fetchWrapper<Wishs[]>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wish),
  });
  return data;
}
