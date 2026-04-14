import { NextResponse } from "next/server";
import { sendEmail, getAdminEmail } from "@/lib/email";
import { adminNewUser, investorWelcome } from "@/lib/emails/templates";

// This endpoint is called after a user confirms their email
// via Supabase auth callback, or can be triggered by a Supabase webhook
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify webhook secret (optional, for Supabase webhooks)
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userName, userEmail, role, company } = body;

    if (!userEmail) {
      return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
    }

    // Notify admin
    const adminTemplate = adminNewUser({
      userName: userName || "Utilisateur",
      userEmail,
      role: role || "investor",
      company,
    });

    // Welcome investor
    const welcomeTemplate = investorWelcome({
      userName: userName || "Investisseur",
    });

    await Promise.all([
      sendEmail({
        to: getAdminEmail(),
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      }),
      sendEmail({
        to: userEmail,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Webhook] new-user error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
