import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { toSnake, toCamel } from "@/lib/serialize";

type Params = { params: Promise<{ id: string }> };

async function canManage(userId: string, role: string, productId: string) {
  if (role === "admin") return true;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { profile: { select: { userId: true } } },
  });
  return product?.profile?.userId === userId;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!(await canManage(auth.user.userId, auth.user.role, id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const raw = await request.json();
  const updated = await prisma.product.update({ where: { id }, data: toCamel(raw) });
  return NextResponse.json(toSnake(updated));
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!(await canManage(auth.user.userId, auth.user.role, id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
