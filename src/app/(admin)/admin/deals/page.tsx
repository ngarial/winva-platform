import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminDealsPage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  const allDeals = deals ?? [];

  const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
    active: { label: "Actif", variant: "success" },
    draft: { label: "Brouillon", variant: "warning" },
    closed: { label: "Fermé", variant: "default" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-white">Deals</h1>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-[var(--radius-md)] text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer un deal
        </Link>
      </div>

      {allDeals.length > 0 ? (
        <div className="space-y-2">
          {allDeals.map((deal) => {
            const status = statusBadge[deal.status] || statusBadge.draft;
            return (
              <Link
                key={deal.id}
                href={`/admin/deals/${deal.id}`}
                className="block bg-midnight-soft rounded-[var(--radius-md)] border border-midnight-elev p-4 hover:border-terracotta/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{deal.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {deal.sector} · {deal.country} · {deal.deal_type}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant={deal.visibility === "private" ? "terracotta" : "outline"}>
                    {deal.visibility === "private" ? "Privé" : "Public"}
                  </Badge>
                  <span className="text-xs text-gray-600">
                    {new Date(deal.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev">
          Aucun deal créé.
        </div>
      )}
    </div>
  );
}
