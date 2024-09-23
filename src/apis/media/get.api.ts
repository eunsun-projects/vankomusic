import { Audios, Videos, Wishs } from '@/types/vanko.type';
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

export async function getCurations() {
  const url = '/api/get/videos';
  const data = await fetchWrapper<Videos[]>(url, { method: 'GET' });
  const curations = data.filter((video) => video.isSelected);
  return curations;
}

export async function getWishs() {
  const url = '/api/get/wishs';
  const data = await fetchWrapper<Wishs[]>(url, { method: 'GET' });
  return data;
}
