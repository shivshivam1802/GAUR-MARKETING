import { NextResponse } from "next/server"
import { ensureLinksTable, sql } from "@/lib/neon"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const targetUrl = typeof body.targetUrl === "string" ? body.targetUrl.trim() : ""
    const alias = typeof body.alias === "string" ? body.alias.trim().toLowerCase() : ""

    try {
      const parsedUrl = new URL(targetUrl)
      if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error()
    } catch {
      return NextResponse.json({ error: "A valid HTTP or HTTPS URL is required" }, { status: 400 })
    }

    if (alias && !/^[a-zA-Z0-9_-]+$/.test(alias)) {
      return NextResponse.json({ error: "Invalid alias" }, { status: 400 })
    }

    await ensureLinksTable()
    const code = alias || crypto.randomBytes(6).toString("base64url")
    const result = await sql`
      INSERT INTO links (code, target_url)
      VALUES (${code}, ${targetUrl})
      RETURNING code
    `

    return NextResponse.json({ code: result[0].code })
  } catch (error: unknown) {
    if (error instanceof Error && error.message.toLowerCase().includes("duplicate key")) {
      return NextResponse.json({ error: "That alias is already in use" }, { status: 409 })
    }

    console.error("Failed to create tracked link:", error)
    return NextResponse.json({ error: "Unable to create link" }, { status: 500 })
  }
}