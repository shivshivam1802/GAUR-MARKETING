import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Handle /link?url=...
  if (url.pathname === "/link") {
    const target = url.searchParams.get("url");

    if (target) {
      return NextResponse.redirect(target);
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
