import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { toSnake, toCamel } from "@/lib/serialize";

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");
  if (!profileId) return NextResponse.json({ error: "profileId requis" }, { status: 400 });

  const promotions = await prisma.promotion.findMany({
    where: { profileId, isActive: true },
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json(toSnake(promotions));
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json();
  const body = toCamel(raw);

  const profile = await prisma.profile.findUnique({ where: { id: body.profileId } });
  if (!profile || (profile.userId !== auth.user.userId && auth.user.role !== "admin")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const promotion = await prisma.promotion.create({ data: body });
  return NextResponse.json(toSnake(promotion), { status: 201 });
}
