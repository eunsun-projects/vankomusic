import { Audios } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data: audios, error }: { data: Audios[] | null; error: PostgrestError | null } =
    await supabase.from('audios').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(audios, { status: 200 });
}
