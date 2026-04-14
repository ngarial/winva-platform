import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function InterestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: eois } = await supabase
    .from("expressions_of_interest")
    .select("*, deals(id, title, sector, country, deal_type)")
    .eq("investor_id", user.id)
    .order("created_at", { ascending: false });

  const interests = eois ?? [];

  const statusLabels: Record<string, { label: string; variant: "default" | "warning" | "success" | "terracotta" }> = {
    pending: { label: "En attente", variant: "warning" },
    reviewed: { label: "En cours d'examen", variant: "terracotta" },
    accepted: { label: "Accepté", variant: "success" },
    rejected: { label: "Décliné", variant: "default" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          Mes expressions d&apos;intérêt
        </h1>
        <p className="text-text-soft mt-1">
          Suivez le statut de vos demandes.
        </p>
      </div>

      {interests.length > 0 ? (
        <div className="space-y-4">
          {interests.map((eoi) => {
            const deal = eoi.deals as { id: string; title: string; sector: string; country: string; deal_type: string } | null;
            const status = statusLabels[eoi.status] || statusLabels.pending;
            return (
              <Card key={eoi.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <Link
                    href={`/deals/${deal?.id}`}
                    className="font-display text-lg font-semibold text-midnight hover:text-terracotta transition-colors"
                  >
                    {deal?.title || "Deal supprimé"}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {deal && <Badge variant="outline">{deal.sector}</Badge>}
                    {deal && <Badge variant="default">{deal.country}</Badge>}
                  </div>
                  {eoi.message && (
                    <p className="text-sm text-text-soft mt-2">&ldquo;{eoi.message}&rdquo;</p>
                  )}
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-text-soft">Vous n&apos;avez pas encore exprimé d&apos;intérêt.</p>
          <Link
            href="/deals"
            className="text-sm text-terracotta hover:text-terracotta-dark font-medium mt-2 inline-block"
          >
            Découvrir les deals &rarr;
          </Link>
        </Card>
      )}
    </div>
  );
}
