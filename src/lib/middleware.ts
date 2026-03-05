import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "./auth";

export function requireAuth(
  request: NextRequest
): { user: JwtPayload } | NextResponse {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }

  return { user };
}

export function requireAdmin(
  request: NextRequest
): { user: JwtPayload } | NextResponse {
  const result = requireAuth(request);

  if (result instanceof NextResponse) return result;

  if (result.user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return result;
}
