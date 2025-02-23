import { StarFromSupabase } from '@/types/projects.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { data: stars, error }: { data: StarFromSupabase | null; error: PostgrestError | null } =
    await supabase.from('stars').select('*').eq('user_email', email).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!stars) {
    return NextResponse.json({ error: 'Stars not found' }, { status: 404 });
  }

  return NextResponse.json(stars, { status: 200 });
}
