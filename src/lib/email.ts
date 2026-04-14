import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "WINVA <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bn.ngarial@gmail.com";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("[Email Error]", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Email Exception]", err);
    return { success: false, error: err };
  }
}

export function getAdminEmail() {
  return ADMIN_EMAIL;
}
