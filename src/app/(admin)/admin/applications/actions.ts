"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(
  applicationId: string,
  status: "reviewed" | "accepted" | "rejected"
) {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("sme_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/applications");
  return { success: true };
}
