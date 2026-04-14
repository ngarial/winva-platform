import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EditDealClient } from "./edit-deal-client";

export default async function AdminDealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: deal } = await supabase.from("deals").select("*").eq("id", id).single();
  if (!deal) notFound();

  const [filesRes, accessRes, investorsRes] = await Promise.all([
    supabase.from("dataroom_files").select("*").eq("deal_id", id).order("created_at", { ascending: false }),
    supabase.from("deal_access").select("*, profiles!deal_access_investor_id_fkey(full_name, company)").eq("deal_id", id),
    supabase.from("profiles").select("id, full_name, company").eq("role", "investor").eq("status", "approved"),
  ]);

  return (
    <EditDealClient
      deal={deal}
      files={filesRes.data ?? []}
      accessList={accessRes.data ?? []}
      investors={investorsRes.data ?? []}
    />
  );
}
