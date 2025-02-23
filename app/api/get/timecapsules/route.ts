import { TimeCapsuleFromSupabase } from '@/types/projects.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: timeCapsules,
    error,
  }: { data: TimeCapsuleFromSupabase[] | null; error: PostgrestError | null } = await supabase
    .from('timecapsules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(timeCapsules, { status: 200 });
}
