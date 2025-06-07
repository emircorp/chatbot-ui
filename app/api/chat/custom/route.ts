import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    // messages içindeki sadece content'leri al
    const contents = messages.map((m: any) => m.content)

    const response = await fetch("http://31.97.15.252:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: contents
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    const responseData = await response.json()

    return NextResponse.json({
      message: responseData.reply || responseData.message || "No reply"
    })
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
