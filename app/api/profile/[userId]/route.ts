import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/supabase/types"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  console.log("API çağrısı başladı, userId:", params.userId)

  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name)
          console.log(`Cookie getirildi: ${name}=${cookie?.value}`)
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

  console.log("Supabase sorgusu tamamlandı", { data, error })

  if (error) {
    console.error("Supabase hatası:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    console.warn("Kullanıcı bulunamadı:", params.userId)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
