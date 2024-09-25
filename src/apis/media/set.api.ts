import { Audios, PartialVideos, Videos, Wishs } from '@/types/vanko.type';
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

export async function setCuration(curations: Videos[]) {
  const url = '/api/set/curations';
  const data = await fetchWrapper<Videos[]>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(curations),
  });
  return data;
}

export async function setVideos({
  video,
  mode,
}: {
  video: PartialVideos | Videos[];
  mode: string;
}) {
  if (mode === 'delete') {
    const url = `/api/set/videos`;
    const data = await fetchWrapper<Videos[]>(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video),
    });
    return data;
  } else {
    const url = `/api/set/videos?mode=${mode}`;
    const data = await fetchWrapper<Videos[]>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video),
    });
    return data;
  }
}

export async function setAudios({
  files,
  audios,
  mode,
}: {
  files: FormData | null;
  audios: Audios[] | Audios | null;
  mode: string;
}) {
  if (mode === 'add') {
    const url = `/api/set/audios?mode=${mode}`;
    const data = await fetchWrapper<Audios[]>(url, {
      method: 'POST',
      body: files,
    });
    return data;
  } else if (mode === 'order') {
    const url = `/api/set/audios?mode=${mode}`;
    const data = await fetchWrapper<Audios[]>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audios),
    });
    return data;
  } else {
    const url = '/api/set/audios';
    const data = await fetchWrapper<Audios[]>(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audios),
    });
    return data;
  }
}
