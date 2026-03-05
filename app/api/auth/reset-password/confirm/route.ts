import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 6 caractères" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
    }
    if (resetToken.usedAt) {
      return NextResponse.json({ error: "Ce lien a déjà été utilisé" }, { status: 400 });
    }
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ce lien a expiré" }, { status: 400 });
    }

    // Mettre à jour le mot de passe et marquer le token comme utilisé
    const passwordHash = await hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Connecter l'utilisateur directement
    const userRole = await prisma.userRole.findFirst({ where: { userId: resetToken.userId } });
    const role = userRole?.role === "admin" ? "admin" : "user";
    const jwtToken = signToken({ userId: resetToken.user.id, email: resetToken.user.email, role });
    const cookie = createAuthCookie(jwtToken);

    const response = NextResponse.json({
      success: true,
      user: { id: resetToken.user.id, email: resetToken.user.email, role },
    });
    response.cookies.set(cookie);
    return response;
  } catch (error: any) {
    console.error("Confirm reset error:", error);
    return NextResponse.json({ error: error?.message || "Erreur serveur" }, { status: 500 });
  }
}
