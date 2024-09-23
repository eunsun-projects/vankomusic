import { Videos } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const curationList: Videos[] = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('videos')
    .upsert(curationList)
    .eq('isSelected', true)
    .select('*');

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  revalidatePath('/archive', 'page');
  return NextResponse.json(data, { status: 200 });
}
