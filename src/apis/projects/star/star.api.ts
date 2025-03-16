import { StarFromSupabase } from '@/types/projects.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function getStars(email: string | null) {
  if (!email) return null;
  const url = `/api/get/stars?email=${email}`;
  const data = await fetchWrapper<StarFromSupabase>(url, { method: 'GET' });
  return data;
}

export async function postStar(star: StarFromSupabase) {
  const url = `/api/set/stars`;
  const data = await fetchWrapper<StarFromSupabase>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ star }),
  });
  return data;
}

export async function putStar(star: StarFromSupabase) {
  const url = `/api/set/stars`;
  const data = await fetchWrapper<StarFromSupabase>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ star }),
  });
  return data;
}
