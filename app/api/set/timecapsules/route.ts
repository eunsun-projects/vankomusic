import type { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { TimeCapsule } from '@/types/projects.type';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

type TimeCapsuleRow = Tables<'timecapsules'>;
type TimeCapsuleInsert = TablesInsert<'timecapsules'>;
type TimeCapsuleUpdate = TablesUpdate<'timecapsules'>;
type TimeCapsuleRequest = Partial<TimeCapsule>;

function createTimeCapsuleInsertPayload(timeCapsule: TimeCapsuleRequest): TimeCapsuleInsert | null {
  if (!timeCapsule.position) {
    return null;
  }

  const payload: TimeCapsuleInsert = {
    position: timeCapsule.position,
  };

  if (timeCapsule.color !== undefined) payload.color = timeCapsule.color;
  if (timeCapsule.created_at !== undefined) payload.created_at = timeCapsule.created_at;
  if (timeCapsule.description !== undefined) payload.description = timeCapsule.description;
  if (timeCapsule.id !== undefined) payload.id = timeCapsule.id;
  if (timeCapsule.password !== undefined) payload.password = timeCapsule.password;
  if (timeCapsule.title !== undefined) payload.title = timeCapsule.title;
  if (timeCapsule.updated_at !== undefined) payload.updated_at = timeCapsule.updated_at;
  if (timeCapsule.user_email !== undefined) payload.user_email = timeCapsule.user_email;

  return payload;
}

function createTimeCapsuleUpdatePayload(timeCapsule: TimeCapsuleRequest): TimeCapsuleUpdate {
  const payload: TimeCapsuleUpdate = {};

  if (timeCapsule.color !== undefined) payload.color = timeCapsule.color;
  if (timeCapsule.created_at !== undefined) payload.created_at = timeCapsule.created_at;
  if (timeCapsule.description !== undefined) payload.description = timeCapsule.description;
  if (timeCapsule.id !== undefined) payload.id = timeCapsule.id;
  if (timeCapsule.password !== undefined) payload.password = timeCapsule.password;
  if (timeCapsule.position !== undefined) payload.position = timeCapsule.position;
  if (timeCapsule.title !== undefined) payload.title = timeCapsule.title;
  if (timeCapsule.updated_at !== undefined) payload.updated_at = timeCapsule.updated_at;
  if (timeCapsule.user_email !== undefined) payload.user_email = timeCapsule.user_email;

  return payload;
}

export async function POST(request: Request) {
  const timeCapsule: TimeCapsuleRequest = await request.json();
  const timeCapsulePayload = createTimeCapsuleInsertPayload(timeCapsule);

  if (!timeCapsulePayload) {
    return NextResponse.json('Missing time capsule position', { status: 400 });
  }

  const supabase = await createClient();

  const { data, error }: { data: TimeCapsuleRow | null; error: PostgrestError | null } =
    await supabase
      .from('timecapsules')
      .upsert(timeCapsulePayload, { onConflict: 'id' })
      .select()
      .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: Request) {
  const timeCapsule: TimeCapsuleRequest = await request.json();

  if (!timeCapsule.id) {
    return NextResponse.json('Missing time capsule id', { status: 400 });
  }

  const timeCapsulePayload = createTimeCapsuleUpdatePayload(timeCapsule);
  const supabase = await createClient();

  const { data, error }: { data: TimeCapsuleRow | null; error: PostgrestError | null } =
    await supabase
      .from('timecapsules')
      .update(timeCapsulePayload)
      .eq('id', timeCapsule.id)
      .select()
      .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
  const timeCapsule: TimeCapsuleRequest = await request.json();

  if (!timeCapsule.id) {
    return NextResponse.json('Missing time capsule id', { status: 400 });
  }

  const supabase = await createClient();

  const { data, error }: { data: TimeCapsuleRow | null; error: PostgrestError | null } =
    await supabase.from('timecapsules').delete().eq('id', timeCapsule.id).select().single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
