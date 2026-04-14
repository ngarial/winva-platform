"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail, getAdminEmail } from "@/lib/email";
import { adminNewApplication, smeApplicationConfirmed } from "@/lib/emails/sme-templates";

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();

  // Get user if logged in (optional)
  const { data: { user } } = await supabase.auth.getUser();

  const companyName = formData.get("company_name") as string;
  const sector = formData.get("sector") as string;
  const country = formData.get("country") as string;
  const revenue = formData.get("revenue") as string || null;
  const fundingNeed = formData.get("funding_need") as string || null;
  const contactName = formData.get("contact_name") as string;
  const contactEmail = formData.get("contact_email") as string;
  const contactPhone = formData.get("contact_phone") as string || null;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("sme_applications").insert({
    user_id: user?.id || null,
    company_name: companyName,
    sector,
    country,
    revenue,
    funding_need: fundingNeed,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    description,
  });

  if (error) throw new Error(error.message);

  // Send emails
  try {
    const adminTemplate = adminNewApplication({
      companyName,
      sector,
      country,
      contactName,
      contactEmail,
      fundingNeed: fundingNeed || undefined,
    });

    const smeTemplate = smeApplicationConfirmed({
      contactName,
      companyName,
    });

    await Promise.all([
      sendEmail({
        to: getAdminEmail(),
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      }),
      sendEmail({
        to: contactEmail,
        subject: smeTemplate.subject,
        html: smeTemplate.html,
      }),
    ]);
  } catch {
    console.error("[Email] Failed to send application notifications");
  }

  return { success: true };
}
