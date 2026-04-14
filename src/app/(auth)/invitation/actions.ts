"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function verifyInvitation(token: string) {
  const adminClient = createAdminClient();

  const { data: invitation } = await adminClient
    .from("invitations")
    .select("*, access_requests(*)")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!invitation) return { valid: false, invitation: null };

  return { valid: true, invitation };
}

export async function createInvitedAccount(token: string, password: string) {
  const adminClient = createAdminClient();

  // Verify token again
  const { data: invitation } = await adminClient
    .from("invitations")
    .select("*, access_requests(*)")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!invitation) throw new Error("Invitation invalide ou expirée");

  const request = invitation.access_requests;

  // Create Supabase auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: invitation.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: request?.full_name || "",
      role: "investor",
      company: request?.company || "",
    },
  });

  if (authError) throw new Error(authError.message);

  // Update profile with all request data
  if (authData.user && request) {
    await adminClient.from("profiles").update({
      full_name: request.full_name,
      company: request.company,
      phone: request.phone,
      country: request.country,
      status: "approved",
      investor_type: request.investor_type,
      sectors_of_interest: request.sectors_of_interest,
      ticket_min: request.ticket_min,
      preferred_deal_type: request.preferred_deal_type,
      referral_source: request.referral_source,
    }).eq("id", authData.user.id);
  }

  // Mark invitation as used
  await adminClient
    .from("invitations")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invitation.id);

  // Mark access request as approved
  if (request) {
    await adminClient
      .from("access_requests")
      .update({ status: "approved" })
      .eq("id", request.id);
  }

  return { success: true, email: invitation.email };
}
