import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { InvestorsClient } from "./investors-client";

export default async function AdminInvestorsPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [investorsRes, requestsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, nda_count:nda_acceptances(count), eoi_count:expressions_of_interest(count)")
      .eq("role", "investor")
      .order("created_at", { ascending: false }),
    adminClient
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <InvestorsClient
      investors={investorsRes.data ?? []}
      accessRequests={requestsRes.data ?? []}
    />
  );
}
