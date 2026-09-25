import { NextResponse } from "next/server"
import { ensureLinksTable, sql } from "@/lib/neon"

type LinkRow = { target_url: string }

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  try {
    await ensureLinksTable()
    const rows = (await sql`
      UPDATE links
      SET visits = visits + 1
      WHERE code = ${code}
      RETURNING target_url
    `) as LinkRow[]

    if (rows[0]?.target_url) {
      return NextResponse.redirect(rows[0].target_url)
    }
  } catch (error) {
    console.error("Failed to forward tracked link:", error)
  }

  return NextResponse.redirect(new URL("/?error=invalid_url", _request.url))
}
