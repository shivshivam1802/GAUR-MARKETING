import { NextResponse } from "next/server"
import { buildLinkCode, ensureLinksTable, findOrCreateLink, incrementLinkVisits, normalizeTargetUrl } from "@/lib/neon"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const targetParam = url.searchParams.get("url")

  if (!targetParam) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const destination = new URL(normalizeTargetUrl(targetParam))
  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "url") {
      destination.searchParams.append(key, value)
    }
  }

  const finalTargetUrl = destination.toString()
  const code = buildLinkCode(finalTargetUrl)

  await ensureLinksTable()
  await findOrCreateLink(finalTargetUrl, code)
  const link = await incrementLinkVisits(code)

  return NextResponse.redirect(link?.target_url || finalTargetUrl)
}
