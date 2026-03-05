import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { toSnake, toCamel } from "@/lib/serialize";

export async function GET() {
  const info = await prisma.companyInfo.findFirst();
  return NextResponse.json(toSnake(info));
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json();
  const body = toCamel(raw);
  const existing = await prisma.companyInfo.findFirst();

  if (!existing) {
    const created = await prisma.companyInfo.create({ data: body });
    return NextResponse.json(toSnake(created), { status: 201 });
  }

  const updated = await prisma.companyInfo.update({
    where: { id: existing.id },
    data: body,
  });
  return NextResponse.json(toSnake(updated));
}
