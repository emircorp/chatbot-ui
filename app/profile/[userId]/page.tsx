import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/supabase/types"

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() }
  )

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.userId)
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return <div>User not found</div>

  return (
    <div>
      <h1>{data.display_name}</h1>
      {/* Profil bilgilerini buraya koy */}
    </div>
  )
}
