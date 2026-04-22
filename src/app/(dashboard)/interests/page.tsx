import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function InterestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const t = await getTranslations("interests");
  const td = await getTranslations("deals");

  const { data: eois } = await supabase
    .from("expressions_of_interest")
    .select("*, deals(id, title, sector, country, deal_type)")
    .eq("investor_id", user.id)
    .order("created_at", { ascending: false });

  const interests = eois ?? [];

  const statusMeta: Record<string, { key: "pending" | "reviewed" | "accepted" | "rejected"; variant: "default" | "warning" | "success" | "terracotta" }> = {
    pending: { key: "pending", variant: "warning" },
    reviewed: { key: "reviewed", variant: "terracotta" },
    accepted: { key: "accepted", variant: "success" },
    rejected: { key: "rejected", variant: "default" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          {t("title")}
        </h1>
        <p className="text-text-soft mt-1">{t("subtitle")}</p>
      </div>

      {interests.length > 0 ? (
        <div className="space-y-4">
          {interests.map((eoi) => {
            const deal = eoi.deals as { id: string; title: string; sector: string; country: string; deal_type: string } | null;
            const status = statusMeta[eoi.status] || statusMeta.pending;
            return (
              <Card key={eoi.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <Link
                    href={`/deals/${deal?.id}`}
                    className="font-display text-lg font-semibold text-midnight hover:text-terracotta transition-colors"
                  >
                    {deal?.title || td("dealDeleted")}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {deal && <Badge variant="outline">{deal.sector}</Badge>}
                    {deal && <Badge variant="default">{deal.country}</Badge>}
                  </div>
                  {eoi.message && (
                    <p className="text-sm text-text-soft mt-2">&ldquo;{eoi.message}&rdquo;</p>
                  )}
                </div>
                <Badge variant={status.variant}>{t(`status.${status.key}`)}</Badge>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-text-soft">{t("empty")}</p>
          <Link
            href="/deals"
            className="text-sm text-terracotta hover:text-terracotta-dark font-medium mt-2 inline-block"
          >
            {t("discoverDeals")}
          </Link>
        </Card>
      )}
    </div>
  );
}
