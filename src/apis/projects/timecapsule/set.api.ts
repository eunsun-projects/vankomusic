import { TimeCapsule } from '@/types/projects.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function postTimeCapsule(timeCapsule: Partial<TimeCapsule>) {
  const url = '/api/set/timecapsules';
  const data = await fetchWrapper<TimeCapsule>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(timeCapsule),
  });
  return data;
}
