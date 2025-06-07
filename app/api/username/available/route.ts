export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    if (typeof username !== 'string' || username.length < 3) {
      return NextResponse.json({ isAvailable: false }, { status: 400 });
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('[USERNAME_CHECK_ERROR]', error);
      return NextResponse.json({ isAvailable: false }, { status: 500 });
    }

    const isAvailable = !data;

    return NextResponse.json({ isAvailable });
  } catch (err) {
    console.error('[USERNAME_CHECK_EXCEPTION]', err);
    return NextResponse.json({ isAvailable: false }, { status: 500 });
  }
}
