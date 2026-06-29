import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "gaur-links-secret-super-key-2026-campaign"

function verifyJwtEdge(token: string): any | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url")

    if (signature !== expectedSignature) {
      return null
    }

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
  } catch (error) {
    return null
  }
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const { pathname } = url

  // Handle /link?url=...
  if (pathname === "/link") {
    const target = url.searchParams.get("url")
    if (target) {
      return NextResponse.redirect(target)
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  const token = request.cookies.get("gaur_session")?.value

  const protectedPaths = ["/about", "/services", "/contact"]

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    const payload = verifyJwtEdge(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (payload.role !== "admin" && payload.paymentStatus !== "verified") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (pathname.startsWith("/admin/payments")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    const payload = verifyJwtEdge(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}
