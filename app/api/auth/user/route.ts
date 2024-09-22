import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (error.message === 'Auth session missing!')
      return NextResponse.json('Auth session missing!', { status: 200 });

    if (error.message === 'Unauthorized')
      return NextResponse.json(
        { user: null, error: '인증되지 않은 사용자입니다.' },
        { status: 401 },
      );
    return NextResponse.json(error?.message, { status: 401 });
  }
  if (!user) {
    return NextResponse.json('Logged in user not found', { status: 404 });
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error(userError);
    return NextResponse.json(userError?.message, { status: 401 });
  }

  console.log('userData', userData);

  return NextResponse.json(userData, { status: 200 });
}

// 서버에서 요청할 때
export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const supabase = createClient();
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error(userError);
    return NextResponse.json({ error: userError?.message }, { status: 401 });
  }

  return NextResponse.json(user, { status: 200 });
}

export async function DELETE() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json('Logout failed', { status: 500 });
  }

  return NextResponse.json('Logout successful', { status: 200 });
}
