import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LANG = "20";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const langParam = url.searchParams.get("lang");
  const cookieLang = req.cookies.get("lang")?.value;

  // If URL has lang → sync cookie
  if (langParam) {
    const res = NextResponse.next();
    res.cookies.set("lang", langParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  // If cookie exists but URL missing → inject
  if (!langParam && cookieLang) {
    url.searchParams.set("lang", cookieLang);
    return NextResponse.redirect(url);
  }

  // If nothing → set default
  if (!langParam && !cookieLang) {
    url.searchParams.set("lang", DEFAULT_LANG);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};
