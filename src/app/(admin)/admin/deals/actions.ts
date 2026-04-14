"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createDeal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("deals").insert({
    title: formData.get("title") as string,
    sector: formData.get("sector") as string,
    country: formData.get("country") as string,
    revenue_range: formData.get("revenue_range") as string || null,
    ticket_size: formData.get("ticket_size") as string || null,
    deal_type: formData.get("deal_type") as string,
    stage: formData.get("stage") as string || null,
    description: formData.get("description") as string,
    status: formData.get("status") as string || "draft",
    visibility: formData.get("visibility") as string || "public",
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/deals");
  return { success: true };
}

export async function updateDeal(dealId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("deals")
    .update({
      title: formData.get("title") as string,
      sector: formData.get("sector") as string,
      country: formData.get("country") as string,
      revenue_range: formData.get("revenue_range") as string || null,
      ticket_size: formData.get("ticket_size") as string || null,
      deal_type: formData.get("deal_type") as string,
      stage: formData.get("stage") as string || null,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      visibility: formData.get("visibility") as string,
    })
    .eq("id", dealId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/deals/${dealId}`);
  revalidatePath("/admin/deals");
  return { success: true };
}

export async function uploadDataroomFile(dealId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const file = formData.get("file") as File;
  if (!file) throw new Error("Aucun fichier");

  const adminClient = createAdminClient();
  const filePath = `${dealId}/${crypto.randomUUID()}_${file.name}`;

  // Upload to Storage
  const { error: uploadError } = await adminClient.storage
    .from("dataroom")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // Insert record in DB
  const { error: dbError } = await adminClient.from("dataroom_files").insert({
    deal_id: dealId,
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type,
    uploaded_by: user.id,
  });

  if (dbError) throw new Error(dbError.message);

  revalidatePath(`/admin/deals/${dealId}`);
  return { success: true };
}

export async function deleteDataroomFile(fileId: string, filePath: string, dealId: string) {
  const adminClient = createAdminClient();

  await adminClient.storage.from("dataroom").remove([filePath]);
  await adminClient.from("dataroom_files").delete().eq("id", fileId);

  revalidatePath(`/admin/deals/${dealId}`);
  return { success: true };
}

export async function grantDealAccess(dealId: string, investorId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("deal_access").insert({
    deal_id: dealId,
    investor_id: investorId,
    granted_by: user?.id,
  });

  if (error && error.code !== "23505") throw new Error(error.message);

  revalidatePath(`/admin/deals/${dealId}`);
  return { success: true };
}

export async function revokeDealAccess(dealId: string, investorId: string) {
  const adminClient = createAdminClient();

  await adminClient
    .from("deal_access")
    .delete()
    .eq("deal_id", dealId)
    .eq("investor_id", investorId);

  revalidatePath(`/admin/deals/${dealId}`);
  return { success: true };
}
