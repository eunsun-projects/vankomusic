import { Star, StarFromSupabase } from '@/types/projects.type';
import fetchWrapper from '@/utils/common/fetchWrapper';

export async function getStars(email: string) {
  const url = `/api/get/stars?email=${email}`;
  const data = await fetchWrapper<Star[]>(url, { method: 'GET' });
  return data;
}

export async function postStar(email: string, star: StarFromSupabase) {
  const url = `/api/set/stars`;
  const data = await fetchWrapper<Star>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, star }),
  });
  return data;
}

export async function putStar(email: string, star: StarFromSupabase) {
  const url = `/api/set/stars`;
  const data = await fetchWrapper<Star>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, star }),
  });
  return data;
}
