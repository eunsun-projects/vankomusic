import { StarFromSupabase } from '@/types/projects.type';
import { Database } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { star }: { star: StarFromSupabase } = await request.json();
  const supabase = await createClient<Database>();

  const { data: starData, error } = await supabase
    .from('stars')
    .insert({ ...star })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(starData, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const { star }: { star: StarFromSupabase } = await request.json();
  const supabase = await createClient<Database>();

  const { data: starData, error } = await supabase
    .from('stars')
    .update({ ...star })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(starData, { status: 200 });
}
