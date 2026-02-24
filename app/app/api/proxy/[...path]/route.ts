import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const apiPath = path.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${API_URL}/api/${apiPath}${searchParams ? `?${searchParams}` : ""}`

  if (!API_URL) {
    return NextResponse.json(
      { error: "API URL not configured. Set NEXT_PUBLIC_API_URL in environment variables." },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `API responded with ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json(
      { error: "Failed to connect to API" },
      { status: 502 }
    )
  }
}
