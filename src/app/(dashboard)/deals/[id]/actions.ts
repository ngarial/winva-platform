"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { sendEmail, getAdminEmail } from "@/lib/email";
import { adminNdaSigned, adminEoi, investorEoiConfirmed } from "@/lib/emails/templates";

export async function acceptNDAWithKYC(dealId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

  const kycFile = formData.get("file") as File;
  const kycType = formData.get("kyc_type") as string;

  // 1. Upload KYC document
  if (kycFile) {
    const filePath = `${user.id}/${dealId}/${crypto.randomUUID()}_${kycFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("kyc")
      .upload(filePath, kycFile);

    if (uploadError) throw new Error("Erreur d'upload du document KYC");

    // Insert KYC record
    await supabase.from("kyc_documents").insert({
      investor_id: user.id,
      deal_id: dealId,
      document_type: kycType,
      file_path: filePath,
      file_name: kycFile.name,
      file_size: kycFile.size,
    });
  }

  // 2. Accept NDA
  const { error } = await supabase.from("nda_acceptances").insert({
    investor_id: user.id,
    deal_id: dealId,
    ip_address: ip,
  });

  if (error) {
    if (error.code === "23505") return { success: true };
    throw new Error(error.message);
  }

  // 3. Send email notification to admin
  try {
    const [profileRes, dealRes] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase.from("deals").select("title").eq("id", dealId).single(),
    ]);

    const template = adminNdaSigned({
      investorName: profileRes.data?.full_name || "Investisseur",
      investorEmail: user.email || "",
      dealTitle: dealRes.data?.title || "Deal",
    });

    await sendEmail({
      to: getAdminEmail(),
      subject: template.subject,
      html: template.html,
    });
  } catch {
    console.error("[Email] Failed to send NDA notification");
  }

  return { success: true };
}

export async function submitEOI(dealId: string, message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("expressions_of_interest").insert({
    investor_id: user.id,
    deal_id: dealId,
    message: message || null,
  });

  if (error) throw new Error(error.message);

  // Send email notifications
  try {
    const [profileRes, dealRes] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase.from("deals").select("title").eq("id", dealId).single(),
    ]);

    const investorName = profileRes.data?.full_name || "Investisseur";
    const dealTitle = dealRes.data?.title || "Deal";

    // Notify admin
    const adminTemplate = adminEoi({
      investorName,
      investorEmail: user.email || "",
      dealTitle,
      message: message || undefined,
    });

    // Confirm to investor
    const investorTemplate = investorEoiConfirmed({
      userName: investorName,
      dealTitle,
    });

    await Promise.all([
      sendEmail({
        to: getAdminEmail(),
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      }),
      sendEmail({
        to: user.email!,
        subject: investorTemplate.subject,
        html: investorTemplate.html,
      }),
    ]);
  } catch {
    console.error("[Email] Failed to send EOI notifications");
  }

  return { success: true };
}

export async function getFileDownloadUrl(filePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase.storage
    .from("dataroom")
    .createSignedUrl(filePath, 3600);

  if (error) throw new Error(error.message);

  return { url: data.signedUrl };
}
