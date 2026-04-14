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

export function adminNewApplication(data: {
  companyName: string;
  sector: string;
  country: string;
  contactName: string;
  contactEmail: string;
  fundingNeed?: string;
}): { subject: string; html: string } {
  return {
    subject: `[WINVA] Nouvelle candidature PME — ${data.companyName}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Nouvelle candidature PME
      </h2>
      <p style="margin:0 0 20px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Une nouvelle PME a soumis sa candidature sur la plateforme WINVA.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.ivory};border-radius:10px;padding:20px;">
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Entreprise</td>
            <td style="padding:8px 16px;font-size:13px;font-weight:600;color:${BRAND.midnight};">${data.companyName}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Secteur</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.sector}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Pays</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.country}</td></tr>
        <tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Contact</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.midnight};">${data.contactName} (${data.contactEmail})</td></tr>
        ${data.fundingNeed ? `<tr><td style="padding:8px 16px;font-size:13px;color:${BRAND.gray};">Besoin</td>
            <td style="padding:8px 16px;font-size:13px;color:${BRAND.terracotta};font-weight:600;">${data.fundingNeed}</td></tr>` : ""}
      </table>
    `),
  };
}

export function smeApplicationConfirmed(data: {
  contactName: string;
  companyName: string;
}): { subject: string; html: string } {
  return {
    subject: `WINVA — Candidature reçue pour ${data.companyName}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:22px;color:${BRAND.midnight};">
        Candidature reçue
      </h2>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        ${data.contactName}, nous avons bien reçu la candidature de
        <strong style="color:${BRAND.terracotta};">${data.companyName}</strong>
        sur la plateforme WINVA.
      </p>
      <p style="margin:0 0 16px;color:${BRAND.gray};font-size:14px;line-height:1.6;">
        Notre équipe examinera votre dossier dans les meilleurs délais. Nous vous contacterons pour les prochaines étapes.
      </p>
      <div style="padding:16px;background:${BRAND.ivory};border-radius:10px;">
        <p style="margin:0;font-size:13px;color:${BRAND.gray};">
          <strong>Prochaines étapes :</strong> Analyse de votre dossier, entretien préliminaire, et si éligible, préparation à la mise en relation avec nos investisseurs.
        </p>
      </div>
    `),
  };
}
