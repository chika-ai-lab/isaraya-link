import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { toSnake, toCamel } from "@/lib/serialize";

type Params = { params: Promise<{ id: string }> };

async function canManage(userId: string, role: string, commercialId: string) {
  if (role === "admin") return true;
  const commercial = await prisma.commercial.findUnique({
    where: { id: commercialId },
    include: { profile: { select: { userId: true } } },
  });
  return commercial?.profile?.userId === userId;
}

// GET /api/commercials/[id] — infos publiques d'un commercial
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const commercial = await prisma.commercial.findUnique({ where: { id } });
  if (!commercial) return NextResponse.json({ error: "Commercial introuvable" }, { status: 404 });
  return NextResponse.json(toSnake(commercial));
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!(await canManage(auth.user.userId, auth.user.role, id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const raw = await request.json();
  const updated = await prisma.commercial.update({ where: { id }, data: toCamel(raw) });
  return NextResponse.json(toSnake(updated));
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!(await canManage(auth.user.userId, auth.user.role, id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await prisma.commercial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
