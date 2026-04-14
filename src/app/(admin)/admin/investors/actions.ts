"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { investorInvitation } from "@/lib/emails/access-templates";

export async function updateInvestorStatus(investorId: string, status: "approved" | "rejected") {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ status })
    .eq("id", investorId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/investors");
  return { success: true };
}

export async function approveAndInvite(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const adminClient = createAdminClient();

  // Get the access request
  const { data: request } = await adminClient
    .from("access_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (!request) throw new Error("Demande introuvable");

  // Create invitation
  const { data: invitation, error: invError } = await adminClient
    .from("invitations")
    .insert({
      email: request.email,
      access_request_id: requestId,
      created_by: user.id,
    })
    .select("token")
    .single();

  if (invError) throw new Error(invError.message);

  // Send invitation email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const invitationLink = `${appUrl}/invitation?token=${invitation.token}`;

  const template = investorInvitation({
    fullName: request.full_name,
    invitationLink,
  });

  await sendEmail({
    to: request.email,
    subject: template.subject,
    html: template.html,
  });

  // Update request status
  await adminClient
    .from("access_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  revalidatePath("/admin/investors");
  return { success: true };
}

export async function rejectAccessRequest(requestId: string) {
  const adminClient = createAdminClient();

  await adminClient
    .from("access_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  revalidatePath("/admin/investors");
  return { success: true };
}
