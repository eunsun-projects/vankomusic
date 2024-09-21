import { Audios, Videos } from '@/types/vanko.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function getAudios() {
  const url = '/api/get/audios';
  const data = await fetchWrapper<Audios[]>(url, { method: 'GET' });
  return data;
}

export async function getVideos() {
  const url = '/api/get/videos';
  const data = await fetchWrapper<Videos[]>(url, { method: 'GET' });
  return data;
}
