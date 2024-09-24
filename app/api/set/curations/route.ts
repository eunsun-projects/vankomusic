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

  const { data, error } = await supabase.from('videos').upsert(curationList).select();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CURATIONS] });
  revalidatePath('/', 'page');
  return NextResponse.json(data, { status: 200 });
}
