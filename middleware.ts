import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protège /admin et /api/admin par une authentification HTTP Basic.
// Si ADMIN_USER / ADMIN_PASSWORD ne sont pas configurés, l'accès est
// bloqué par défaut (fail-closed) plutôt que laissé ouvert.
export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  const unauthorized = () =>
    new NextResponse("Authentification requise.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Administration", charset="UTF-8"' },
    });

  if (!user || !password) return unauthorized();

  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(":");
  const providedUser = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);

  if (providedUser !== user || providedPassword !== password) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
