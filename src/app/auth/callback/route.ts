import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, getAdminEmail } from "@/lib/email";
import { adminNewUser, investorWelcome } from "@/lib/emails/templates";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Send welcome emails on first login (email confirmation)
      try {
        const user = data.user;
        const meta = user.user_metadata || {};

        // Only send welcome email if user was just created (within last 5 min)
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const isNewUser = (now.getTime() - createdAt.getTime()) < 5 * 60 * 1000;

        if (isNewUser) {
          const userName = meta.full_name || "Utilisateur";
          const role = meta.role || "investor";
          const company = meta.company;

          const adminTemplate = adminNewUser({
            userName,
            userEmail: user.email || "",
            role,
            company,
          });

          const welcomeTemplate = investorWelcome({ userName });

          await Promise.all([
            sendEmail({
              to: getAdminEmail(),
              subject: adminTemplate.subject,
              html: adminTemplate.html,
            }),
            sendEmail({
              to: user.email!,
              subject: welcomeTemplate.subject,
              html: welcomeTemplate.html,
            }),
          ]);
        }
      } catch {
        // Don't block auth flow if email fails
        console.error("[Email] Failed to send welcome emails");
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
