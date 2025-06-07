import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json() as { userId: string }

    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .single()

    if (error) throw error
    if (!data) throw new Error("User not found")

    return new Response(JSON.stringify({ username: data.username }), {
      status: 200
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message || "Unexpected error" }),
      { status: error.status || 500 }
    )
  }
}
