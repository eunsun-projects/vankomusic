import { QUERY_KEY_CURATIONS } from '@/constants/query.constant';
import { Videos } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { QueryClient } from '@tanstack/react-query';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const curationList: Videos[] = await request.json();
  const supabase = createClient();
  const queryClient = new QueryClient();

  // curationList에서 중복된 id를 가진 레코드 제거
  const uniqueCurationList = Array.from(
    new Map(curationList.map((item) => [item.id, item])).values(),
  );

  const { data, error } = await supabase
    .from('videos')
    .upsert(uniqueCurationList, { onConflict: 'id' })
    .select();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CURATIONS] });
  revalidatePath('/', 'layout');
  return NextResponse.json(data, { status: 200 });
}
