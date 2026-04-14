// ============================================
// WINVA Email Templates
// ============================================

const BRAND = {
  midnight: "#0A1929",
  terracotta: "#C2724A",
  ivory: "#FAF8F3",
  gray: "#5C5849",
  lightGray: "#E0DFDC",
};

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BRAND.ivory};font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.ivory};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 24px rgba(10,25,41,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND.midnight};padding:24px 32px;">
            <span style="font-family:'Georgia',serif;font-size:20px;font-weight:700;color:#ffffff;">W</span>
            <span style="font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#ffffff;margin-left:8px;">WINVA</span>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid ${BRAND.lightGray};">
            <p style="margin:0;font-size:12px;color:${BRAND.gray};">
              WINVA — Une marque DARHAN | Abidjan, Côte d'Ivoire
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#A8A5A0;">
              Cet email a été envoyé automatiquement. Ne pas répondre directement.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ============================================
// ADMIN NOTIFICATIONS
// ============================================

export function adminNewUser(data: {
  userName: string;
  userEmail: string;
  role: string;
  company?: string;
}): { subject: string; html: string } {
  const roleLabel = data.role === "investor" ? "Investisseur" : "PME / Entrepreneur";
  return {
    subject: `[WINVA] Nouvelle inscription — ${data.userName}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Nouvelle inscription
      </h2>
      <p style="margin:0 0 20px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Un nouvel utilisateur vient de créer un compte sur la plateforme WINVA.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.ivory};border-radius:10px;padding:20px;">
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Nom</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.midnight};">${data.userName}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Email</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.userEmail}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Rôle</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${roleLabel}</td></tr>
        ${data.company ? `<tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Structure</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.company}</td></tr>` : ""}
      </table>
    `),
  };
}

export function adminNdaSigned(data: {
  investorName: string;
  investorEmail: string;
  dealTitle: string;
}): { subject: string; html: string } {
  return {
    subject: `[WINVA] NDA signé — ${data.dealTitle}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        NDA signé
      </h2>
      <p style="margin:0 0 20px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Un investisseur a signé l'accord de confidentialité pour un deal.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.ivory};border-radius:10px;padding:20px;">
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Investisseur</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.midnight};">${data.investorName}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Email</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.investorEmail}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Deal</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.terracotta};">${data.dealTitle}</td></tr>
      </table>
    `),
  };
}

export function adminEoi(data: {
  investorName: string;
  investorEmail: string;
  dealTitle: string;
  message?: string;
}): { subject: string; html: string } {
  return {
    subject: `[WINVA] Expression d'intérêt — ${data.dealTitle}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Expression d'intérêt
      </h2>
      <p style="margin:0 0 20px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Un investisseur a exprimé son intérêt pour un deal.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.ivory};border-radius:10px;padding:20px;">
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Investisseur</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.midnight};">${data.investorName}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Email</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.investorEmail}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Deal</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.terracotta};">${data.dealTitle}</td></tr>
      </table>
      ${data.message ? `
      <div style="margin-top:16px;padding:16px;background:${BRAND.ivory};border-radius:10px;border-left:3px solid ${BRAND.terracotta};">
        <p style="margin:0 0 4px;font-size:11px;color:${BRAND.gray};text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="margin:0;font-size:14px;color:${BRAND.midnight};line-height:1.5;">${data.message}</p>
      </div>` : ""}
    `),
  };
}

// ============================================
// INVESTOR EMAILS
// ============================================

export function investorWelcome(data: {
  userName: string;
}): { subject: string; html: string } {
  return {
    subject: "Bienvenue sur WINVA — Votre plateforme d'investissement",
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Bienvenue, ${data.userName}
      </h2>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Votre compte sur la plateforme WINVA a bien été créé. Vous avez désormais accès à des opportunités d'investissement exclusives dans les PME africaines.
      </p>
      <p style="margin:0 0 24px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Voici ce que vous pouvez faire :
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:8px 0;font-size:14px;color:${BRAND.midnight};">
          <span style="color:${BRAND.terracotta};font-weight:700;margin-right:8px;">1.</span>
          Parcourir les deals actifs
        </td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:${BRAND.midnight};">
          <span style="color:${BRAND.terracotta};font-weight:700;margin-right:8px;">2.</span>
          Signer le NDA pour accéder aux détails
        </td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:${BRAND.midnight};">
          <span style="color:${BRAND.terracotta};font-weight:700;margin-right:8px;">3.</span>
          Exprimer votre intérêt pour un deal
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:${BRAND.gray};">
        L'équipe WINVA est à votre disposition pour toute question.
      </p>
    `),
  };
}

export function investorEoiConfirmed(data: {
  userName: string;
  dealTitle: string;
}): { subject: string; html: string } {
  return {
    subject: `WINVA — Intérêt enregistré pour "${data.dealTitle}"`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Intérêt enregistré
      </h2>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        ${data.userName}, votre expression d'intérêt pour le deal
        <strong style="color:${BRAND.terracotta};">"${data.dealTitle}"</strong>
        a bien été enregistrée.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        L'équipe WINVA examinera votre demande et vous contactera dans les meilleurs délais pour les prochaines étapes.
      </p>
      <div style="padding:16px;background:${BRAND.ivory};border-radius:10px;">
        <p style="margin:0;font-size:13px;color:${BRAND.gray};">
          <strong>Prochaines étapes :</strong> Un membre de l'équipe WINVA prendra contact avec vous pour discuter de cette opportunité en détail.
        </p>
      </div>
    `),
  };
}
