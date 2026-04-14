import { createClient } from "@/lib/supabase/server";
import { ApplicationsClient } from "./applications-client";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("sme_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return <ApplicationsClient applications={applications ?? []} />;
}
