import { createClient } from "@/lib/supabase/server";
import { DealsPageClient } from "./deals-client";

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const allDeals = deals ?? [];

  // Extract unique sectors and countries for filters
  const sectors = [...new Set(allDeals.map((d) => d.sector))].sort();
  const countries = [...new Set(allDeals.map((d) => d.country))].sort();

  return (
    <DealsPageClient
      deals={allDeals}
      sectors={sectors}
      countries={countries}
    />
  );
}
