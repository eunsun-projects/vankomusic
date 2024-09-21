import { Audios } from '@/types/vanko.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function getAudios() {
  const url = '/api/get/audios';
  const data = await fetchWrapper<Audios[]>(url, { method: 'GET' });
  return data;
}
