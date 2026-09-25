import { NextResponse } from "next/server"
import { buildForwarderTarget, buildLinkCode, ensureLinksTable, findOrCreateLink, incrementLinkVisits } from "@/lib/neon"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const finalTargetUrl = buildForwarderTarget(url.toString())

  if (!finalTargetUrl) {
    return NextResponse.json({ error: "A valid url query parameter is required" }, { status: 400 })
  }
  const code = buildLinkCode(finalTargetUrl)

  await ensureLinksTable()
  await findOrCreateLink(finalTargetUrl, code)
  const link = await incrementLinkVisits(code)

  return NextResponse.redirect(link?.target_url || finalTargetUrl)
}
