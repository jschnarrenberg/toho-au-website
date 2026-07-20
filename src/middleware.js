import { NextResponse } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip if already has locale prefix, or is static file/api
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) return NextResponse.next();

  // Redirect root and all other paths to default locale
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};