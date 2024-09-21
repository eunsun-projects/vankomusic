import { Videos } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data: videos, error }: { data: Videos[] | null; error: PostgrestError | null } =
    await supabase.from('videos').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(videos, { status: 200 });
}
