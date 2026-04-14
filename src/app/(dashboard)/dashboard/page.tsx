import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { DealCard } from "@/components/deals/deal-card";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch stats
  const [dealsRes, eoisRes, ndasRes, recentDealsRes] = await Promise.all([
    supabase.from("deals").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("expressions_of_interest").select("id", { count: "exact", head: true }).eq("investor_id", user.id),
    supabase.from("nda_acceptances").select("id", { count: "exact", head: true }).eq("investor_id", user.id),
    supabase.from("deals").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3),
  ]);

  const dealsCount = dealsRes.count ?? 0;
  const eoisCount = eoisRes.count ?? 0;
  const ndasCount = ndasRes.count ?? 0;
  const recentDeals = recentDealsRes.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          Tableau de bord
        </h1>
        <p className="text-text-soft mt-1">
          Vue d&apos;ensemble de votre activité sur WINVA.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-text-soft">Deals actifs</p>
          <p className="text-3xl font-bold text-terracotta mt-1">{dealsCount}</p>
          <p className="text-xs text-gray-400 mt-1">Opportunités disponibles</p>
        </Card>
        <Card>
          <p className="text-sm text-text-soft">Mes intérêts</p>
          <p className="text-3xl font-bold text-terracotta mt-1">{eoisCount}</p>
          <p className="text-xs text-gray-400 mt-1">Expressions envoyées</p>
        </Card>
        <Card>
          <p className="text-sm text-text-soft">NDA signés</p>
          <p className="text-3xl font-bold text-terracotta mt-1">{ndasCount}</p>
          <p className="text-xs text-gray-400 mt-1">Accès dataroom débloqués</p>
        </Card>
      </div>

      {/* Recent deals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-midnight">
            Deals récents
          </h2>
          <Link
            href="/deals"
            className="text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            Voir tous les deals &rarr;
          </Link>
        </div>

        {recentDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDeals.map((deal) => (
              <DealCard
                key={deal.id}
                id={deal.id}
                title={deal.title}
                sector={deal.sector}
                country={deal.country}
                revenueRange={deal.revenue_range}
                ticketSize={deal.ticket_size}
                dealType={deal.deal_type}
                stage={deal.stage}
                description={deal.description}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-text-soft">Aucun deal actif pour le moment.</p>
            <p className="text-sm text-gray-400 mt-1">
              Les opportunités apparaîtront ici dès qu&apos;elles seront publiées.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
