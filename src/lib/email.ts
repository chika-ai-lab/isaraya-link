import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    replyTo: process.env.EMAIL_REPLY_TO,
    subject: "Réinitialisation de votre mot de passe – STS Link",
    text: `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n${resetUrl}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f9fafb;border-radius:8px;">
        <h2 style="color:#0E2043;margin-bottom:16px;">Réinitialisation du mot de passe</h2>
        <p style="color:#374151;margin-bottom:24px;">
          Vous avez demandé à réinitialiser votre mot de passe sur <strong>STS Link</strong>.
          Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#F58C45;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">
          Ce lien est valide pendant <strong>1 heure</strong>.<br>
          Si vous n'avez pas fait cette demande, ignorez cet email.
        </p>
        <hr style="margin:24px 0;border-color:#e5e7eb;">
        <p style="color:#9ca3af;font-size:12px;">STS Link — Plateforme de profils d'entreprise</p>
      </div>
    `,
  });
}
