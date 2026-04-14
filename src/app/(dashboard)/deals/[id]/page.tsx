import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DealDetailClient } from "./deal-detail-client";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch deal
  const { data: deal } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single();

  if (!deal) notFound();

  // Check NDA status
  const { data: nda } = await supabase
    .from("nda_acceptances")
    .select("id")
    .eq("investor_id", user.id)
    .eq("deal_id", id)
    .maybeSingle();

  // Check EOI status
  const { data: eoi } = await supabase
    .from("expressions_of_interest")
    .select("id")
    .eq("investor_id", user.id)
    .eq("deal_id", id)
    .maybeSingle();

  const hasSignedNDA = !!nda;
  const hasSentEOI = !!eoi;

  // Fetch dataroom files if NDA signed
  let dataroomFiles: { id: string; file_name: string; file_path: string; file_size: number | null; mime_type: string | null; created_at: string }[] = [];
  if (hasSignedNDA) {
    const { data: files } = await supabase
      .from("dataroom_files")
      .select("id, file_name, file_path, file_size, mime_type, created_at")
      .eq("deal_id", id)
      .order("created_at", { ascending: false });
    dataroomFiles = files ?? [];
  }

  const dealTypeBadge: Record<string, { label: string; variant: "terracotta" | "midnight" | "default" }> = {
    equity: { label: "Equity", variant: "terracotta" },
    mezzanine: { label: "Mezzanine", variant: "midnight" },
    debt: { label: "Dette", variant: "default" },
  };

  const typeInfo = dealTypeBadge[deal.deal_type] || dealTypeBadge.equity;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back link */}
      <a
        href="/deals"
        className="inline-flex items-center text-sm text-text-soft hover:text-terracotta transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux deals
      </a>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
          <Badge variant="outline">{deal.sector}</Badge>
          <Badge variant="default">{deal.country}</Badge>
          {deal.stage && <Badge variant="default">{deal.stage}</Badge>}
        </div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          {deal.title}
        </h1>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="!p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
          <p className="text-sm font-semibold text-text mt-1">{typeInfo.label}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pays</p>
          <p className="text-sm font-semibold text-text mt-1">{deal.country}</p>
        </Card>
        {deal.revenue_range && (
          <Card className="!p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">CA indicatif</p>
            <p className="text-sm font-semibold text-text mt-1">{deal.revenue_range}</p>
          </Card>
        )}
        {deal.ticket_size && (
          <Card className="!p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Ticket</p>
            <p className="text-sm font-semibold text-terracotta mt-1">{deal.ticket_size}</p>
          </Card>
        )}
      </div>

      {/* Description teaser */}
      <Card>
        <h2 className="font-display text-lg font-semibold text-midnight mb-3">
          Description
        </h2>
        <p className="text-text-soft leading-relaxed">
          {deal.description}
        </p>
      </Card>

      {/* NDA + EOI + Dataroom section */}
      <DealDetailClient
        dealId={deal.id}
        dealTitle={deal.title}
        hasSignedNDA={hasSignedNDA}
        hasSentEOI={hasSentEOI}
        dataroomFiles={dataroomFiles}
      />
    </div>
  );
}
