import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/supabase/types"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name)
          return cookie ? cookie.value : null
        }
      }
    }
  )

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.userId)
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
