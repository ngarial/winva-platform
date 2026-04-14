import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [dealsRes, investorsRes, ndasRes, eoisRes, appsRes, recentEoisRes] = await Promise.all([
    supabase.from("deals").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "investor"),
    supabase.from("nda_acceptances").select("id", { count: "exact", head: true }),
    supabase.from("expressions_of_interest").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("sme_applications").select("id", { count: "exact", head: true }),
    supabase.from("expressions_of_interest")
      .select("*, profiles!expressions_of_interest_investor_id_fkey(full_name), deals(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentEois = recentEoisRes.data ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold text-white">
        Administration
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Deals" value={dealsRes.count ?? 0} />
        <StatCard label="Investisseurs" value={investorsRes.count ?? 0} />
        <StatCard label="NDA signés" value={ndasRes.count ?? 0} />
        <StatCard label="EOI en attente" value={eoisRes.count ?? 0} />
        <StatCard label="Candidatures PME" value={appsRes.count ?? 0} />
      </div>

      {/* Recent EOIs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">
            Dernières expressions d&apos;intérêt
          </h2>
          <Link href="/admin/deals" className="text-sm text-terracotta hover:text-terracotta-light transition-colors">
            Gérer les deals &rarr;
          </Link>
        </div>

        {recentEois.length > 0 ? (
          <div className="space-y-2">
            {recentEois.map((eoi) => {
              const profile = eoi.profiles as { full_name: string } | null;
              const deal = eoi.deals as { title: string } | null;
              return (
                <div key={eoi.id} className="bg-midnight-soft rounded-[var(--radius-md)] border border-midnight-elev p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">
                      {profile?.full_name || "Investisseur"}
                    </p>
                    <p className="text-xs text-gray-400">
                      intéressé par <span className="text-terracotta">{deal?.title || "Deal"}</span>
                    </p>
                  </div>
                  <Badge variant={eoi.status === "pending" ? "warning" : "success"}>
                    {eoi.status === "pending" ? "En attente" : eoi.status}
                  </Badge>
                  <span className="text-xs text-gray-600">
                    {new Date(eoi.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev">
            Aucune expression d&apos;intérêt pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
