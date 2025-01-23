import { TimeCapsule } from '@/types/projects.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function getTimeCapsules() {
  const url = '/api/get/timecapsules';
  const data = await fetchWrapper<TimeCapsule[]>(url, { method: 'GET' });
  return data;
}
