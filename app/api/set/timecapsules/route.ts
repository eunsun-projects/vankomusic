import { TimeCapsule } from '@/types/projects.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const timeCapsule: TimeCapsule = await request.json();
  const supabase = createClient();

  const { data, error }: { data: TimeCapsule | null; error: PostgrestError | null } = await supabase
    .from('timecapsules')
    .upsert(timeCapsule, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: Request) {
  const timeCapsule: TimeCapsule = await request.json();
  const supabase = createClient();

  const { data, error }: { data: TimeCapsule | null; error: PostgrestError | null } = await supabase
    .from('timecapsules')
    .update(timeCapsule)
    .eq('id', timeCapsule.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
  const timeCapsule: TimeCapsule = await request.json();
  const supabase = createClient();

  const { data, error }: { data: TimeCapsule | null; error: PostgrestError | null } = await supabase
    .from('timecapsules')
    .delete()
    .eq('id', timeCapsule.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
