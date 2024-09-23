import { Wishs } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const wish: Wishs = await request.json();

  const supabase = createClient();

  const { data, error }: { data: Wishs[] | null; error: PostgrestError | null } = await supabase
    .from('wishs')
    .upsert(wish)
    .select()
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
