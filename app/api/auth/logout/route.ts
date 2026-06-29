import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" })

  // Delete cookie
  response.cookies.set("gaur_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}
