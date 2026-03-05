import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  signToken,
  createAuthCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 6 caractères" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    const token = signToken({ userId: user.id, email: user.email, role: "user" });
    const cookie = createAuthCookie(token);

    const response = NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 201 }
    );
    response.cookies.set(cookie);
    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    // Prisma P1010 = access denied on database
    if (error?.code === "P1010") {
      return NextResponse.json(
        { error: "Accès refusé à la base de données. Vérifiez les permissions PostgreSQL." },
        { status: 500 }
      );
    }
    // Prisma P2002 = unique constraint (email already used)
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
