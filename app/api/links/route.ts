import { NextResponse } from "next/server"
import { buildLinkCode, ensureLinksTable, normalizeTargetUrl, sql } from "@/lib/neon"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const targetUrl = typeof body.targetUrl === "string" ? body.targetUrl.trim() : ""
    const alias = typeof body.alias === "string" ? body.alias.trim().toLowerCase() : ""
    const normalizedTarget = normalizeTargetUrl(targetUrl)

    try {
      const parsedUrl = new URL(normalizedTarget)
      if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error()
    } catch {
      return NextResponse.json({ error: "A valid HTTP or HTTPS URL is required" }, { status: 400 })
    }

    if (alias && !/^[a-zA-Z0-9_-]+$/.test(alias)) {
      return NextResponse.json({ error: "Invalid alias" }, { status: 400 })
    }

    await ensureLinksTable()
    const code = alias || buildLinkCode(normalizedTarget) || crypto.randomBytes(6).toString("base64url")

    try {
      const result = await sql`
        INSERT INTO links (code, target_url)
        VALUES (${code}, ${normalizedTarget})
        ON CONFLICT (code) DO UPDATE SET target_url = EXCLUDED.target_url
        RETURNING code
      `

      return NextResponse.json({ code: result[0].code })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.toLowerCase().includes("duplicate key")) {
        return NextResponse.json({ error: "That alias is already in use" }, { status: 409 })
      }
      throw error
    }
  } catch (error: unknown) {
    console.error("Failed to create tracked link:", error)
    return NextResponse.json({ error: "Unable to create link" }, { status: 500 })
  }
}