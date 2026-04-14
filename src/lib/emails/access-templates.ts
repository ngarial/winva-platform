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
        <tr><td style="background:${BRAND.midnight};padding:24px 32px;">
          <span style="font-family:'Georgia',serif;font-size:20px;font-weight:700;color:#ffffff;">W</span>
          <span style="font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#ffffff;margin-left:8px;">WINVA</span>
        </td></tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid ${BRAND.lightGray};">
          <p style="margin:0;font-size:12px;color:${BRAND.gray};">WINVA — Une marque DARHAN | Abidjan, Côte d'Ivoire</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function adminNewAccessRequest(data: {
  fullName: string;
  email: string;
  company?: string;
  investorType?: string;
  ticketMin?: string;
}): { subject: string; html: string } {
  const typeLabels: Record<string, string> = {
    "pe-vc": "Private Equity / VC",
    "family-office": "Family Office",
    "business-angel": "Business Angel",
    "diaspora": "Investisseur Diaspora",
    "impact": "Impact Investor",
    "institutionnel": "Institutionnel",
    "autre": "Autre",
  };
  return {
    subject: `[WINVA] Demande d'accès — ${data.fullName}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Nouvelle demande d'accès
      </h2>
      <p style="margin:0 0 20px;color:${BRAND.gray};font-size:14px;">
        Un investisseur souhaite rejoindre le réseau WINVA.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.ivory};border-radius:10px;padding:20px;">
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Nom</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.midnight};">${data.fullName}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Email</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.email}</td></tr>
        ${data.company ? `<tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Structure</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.company}</td></tr>` : ""}
        ${data.investorType ? `<tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Type</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${typeLabels[data.investorType] || data.investorType}</td></tr>` : ""}
        ${data.ticketMin ? `<tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Ticket min</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.terracotta};font-weight:600;">${data.ticketMin}</td></tr>` : ""}
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:${BRAND.gray};">
        Connectez-vous à l'administration pour examiner cette demande.
      </p>
    `),
  };
}

export function investorAccessReceived(data: {
  fullName: string;
}): { subject: string; html: string } {
  return {
    subject: "WINVA — Demande d'accès reçue",
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Demande reçue
      </h2>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        ${data.fullName}, votre demande d'accès à la plateforme WINVA a bien été reçue.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Notre équipe examinera votre profil sous 48 heures. Si votre candidature est retenue, vous recevrez un lien d'invitation pour créer votre compte et accéder aux opportunités d'investissement.
      </p>
      <div style="padding:16px;background:${BRAND.ivory};border-radius:10px;">
        <p style="margin:0;font-size:13px;color:${BRAND.gray};">
          WINVA est une plateforme privée de capital-investissement. L'accès est réservé aux investisseurs qualifiés.
        </p>
      </div>
    `),
  };
}

export function investorInvitation(data: {
  fullName: string;
  invitationLink: string;
}): { subject: string; html: string } {
  return {
    subject: "WINVA — Votre accès a été approuvé",
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Bienvenue dans le réseau WINVA
      </h2>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        ${data.fullName}, votre demande d'accès a été approuvée.
        Vous pouvez désormais créer votre compte et accéder aux opportunités d'investissement.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${data.invitationLink}" style="display:inline-block;padding:14px 32px;background:${BRAND.terracotta};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;">
          Créer mon compte &rarr;
        </a>
      </div>
      <p style="margin:0;font-size:12px;color:#A8A5A0;text-align:center;">
        Ce lien est valable 7 jours et ne peut être utilisé qu'une seule fois.
      </p>
    `),
  };
}
