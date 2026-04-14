"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, getAdminEmail } from "@/lib/email";
import { adminNewAccessRequest, investorAccessReceived } from "@/lib/emails/access-templates";

export async function submitAccessRequest(formData: FormData) {
  const adminClient = createAdminClient();

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string || null;
  const company = formData.get("company") as string || null;
  const country = formData.get("country") as string || "Côte d'Ivoire";
  const investorType = formData.get("investor_type") as string || null;
  const ticketMin = formData.get("ticket_min") as string || null;
  const preferredDealType = formData.get("preferred_deal_type") as string || null;
  const referralSource = formData.get("referral_source") as string || null;

  // Get sectors checkboxes
  const sectors = formData.getAll("sectors") as string[];

  const { error } = await adminClient.from("access_requests").insert({
    full_name: fullName,
    email,
    phone,
    company,
    country,
    investor_type: investorType || null,
    sectors_of_interest: sectors.length > 0 ? sectors : null,
    ticket_min: ticketMin,
    preferred_deal_type: preferredDealType,
    referral_source: referralSource,
  });

  if (error) throw new Error(error.message);

  // Send emails
  try {
    const adminTemplate = adminNewAccessRequest({
      fullName,
      email,
      company: company || undefined,
      investorType: investorType || undefined,
      ticketMin: ticketMin || undefined,
    });

    const investorTemplate = investorAccessReceived({ fullName });

    await Promise.all([
      sendEmail({ to: getAdminEmail(), subject: adminTemplate.subject, html: adminTemplate.html }),
      sendEmail({ to: email, subject: investorTemplate.subject, html: investorTemplate.html }),
    ]);
  } catch {
    console.error("[Email] Failed to send access request notifications");
  }

  return { success: true };
}
