import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: stars, error } = await supabase.from('stars').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const starsWithoutCredentials = stars?.map((star) => {
    return {
      id: star.id,
      power: star.power,
      created_at: star.created_at,
      updated_at: star.updated_at,
      color: star.color,
      positions: star.positions,
      last_touched_at: star.last_touched_at,
    };
  });

  return NextResponse.json(starsWithoutCredentials, { status: 200 });
}
