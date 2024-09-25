import { Wishs } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data: wishs, error }: { data: Wishs[] | null; error: PostgrestError | null } =
    await supabase.from('wishs').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(wishs, { status: 200 });
}
