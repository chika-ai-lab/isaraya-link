import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { toSnake, toCamel } from "@/lib/serialize";

// GET /api/profiles — profils de l'utilisateur connecté
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const profiles = await prisma.profile.findMany({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(toSnake(profiles));
}

// POST /api/profiles — créer un profil
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json();
  const body = toCamel(raw);
  const { slug, companyName, ...rest } = body;

  if (!slug || !companyName) {
    return NextResponse.json(
      { error: "slug et companyName requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.profile.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "Ce slug est déjà utilisé" },
      { status: 409 }
    );
  }

  const profile = await prisma.profile.create({
    data: {
      slug,
      companyName,
      userId: auth.user.userId,
      ...rest,
    },
  });

  return NextResponse.json(toSnake(profile), { status: 201 });
}
