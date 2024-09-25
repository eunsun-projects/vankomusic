import { PartialVideos, Videos } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const url = request.nextUrl.searchParams;
  const mode = url.get('mode');
  const supabase = createClient();

  if (mode === 'create' || mode === 'update') {
    const video: PartialVideos = await request.json();
    const { data, error }: { data: Videos[] | null; error: PostgrestError | null } = await supabase
      .from('videos')
      .upsert({ ...video, isPublic: true, isSelected: false })
      .select();

    if (error) {
      return NextResponse.json(error.message, { status: 500 });
    }

    revalidatePath('/archive', 'page');
    return NextResponse.json(data, { status: 200 });
  } else if (mode === 'updateAll') {
    const videos: Videos[] = await request.json();
    const { data, error }: { data: Videos[] | null; error: PostgrestError | null } = await supabase
      .from('videos')
      .upsert(videos)
      .select();

    if (error) {
      return NextResponse.json(error.message, { status: 500 });
    }

    revalidatePath('/archive', 'page');
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json('mode is not valid', { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const videos: PartialVideos = await request.json();
  const supabase = createClient();

  const { data, error }: { data: Videos | null; error: PostgrestError | null } = await supabase
    .from('videos')
    .update({ isPublic: false })
    .eq('id', videos.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  revalidatePath('/archive', 'page');
  return NextResponse.json(data, { status: 200 });
}
