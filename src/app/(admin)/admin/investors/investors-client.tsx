"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { updateInvestorStatus, approveAndInvite, rejectAccessRequest } from "./actions";

interface Investor {
  id: string;
  full_name: string;
  company: string | null;
  country: string | null;
  status: string;
  investor_type: string | null;
  created_at: string;
  nda_count: { count: number }[];
  eoi_count: { count: number }[];
}

interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  investor_type: string | null;
  sectors_of_interest: string[] | null;
  ticket_min: string | null;
  preferred_deal_type: string | null;
  referral_source: string | null;
  status: string;
  created_at: string;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  pending: { label: "En attente", variant: "warning" },
  approved: { label: "Approuvé", variant: "success" },
  rejected: { label: "Refusé", variant: "default" },
};

const typeLabels: Record<string, string> = {
  "pe-vc": "Private Equity / VC",
  "family-office": "Family Office",
  "business-angel": "Business Angel",
  "diaspora": "Diaspora",
  "impact": "Impact",
  "institutionnel": "Institutionnel",
  "autre": "Autre",
};

export function InvestorsClient({
  investors,
  accessRequests,
}: {
  investors: Investor[];
  accessRequests: AccessRequest[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"requests" | "investors">("requests");
  const [selected, setSelected] = useState<AccessRequest | null>(null);
  const [inviting, setInviting] = useState(false);

  const pendingRequests = accessRequests.filter((r) => r.status === "pending");

  async function handleApproveAndInvite(requestId: string) {
    setInviting(true);
    await approveAndInvite(requestId);
    setSelected(null);
    setInviting(false);
    router.refresh();
  }

  async function handleReject(requestId: string) {
    await rejectAccessRequest(requestId);
    setSelected(null);
    router.refresh();
  }

  async function handleInvestorStatus(id: string, status: "approved" | "rejected") {
    await updateInvestorStatus(id, status);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">Investisseurs</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-midnight-soft rounded-[var(--radius-md)] p-1 border border-midnight-elev w-fit">
        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors cursor-pointer ${
            tab === "requests" ? "bg-terracotta text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Demandes d&apos;accès
          {pendingRequests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("investors")}
          className={`px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors cursor-pointer ${
            tab === "investors" ? "bg-terracotta text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Investisseurs ({investors.length})
        </button>
      </div>

      {/* Access Requests Tab */}
      {tab === "requests" && (
        <div className="space-y-2">
          {accessRequests.length > 0 ? (
            accessRequests.map((req) => {
              const st = statusBadge[req.status] || statusBadge.pending;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className="bg-midnight-soft rounded-[var(--radius-md)] border border-midnight-elev p-4 hover:border-terracotta/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">{req.full_name}</p>
                      <p className="text-xs text-gray-400">
                        {req.email} · {req.company || "—"} · {typeLabels[req.investor_type || ""] || "—"}
                      </p>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <span className="text-xs text-gray-600">
                      {new Date(req.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev">
              Aucune demande d&apos;accès.
            </div>
          )}
        </div>
      )}

      {/* Investors Tab */}
      {tab === "investors" && (
        <div className="space-y-2">
          {investors.length > 0 ? (
            investors.map((inv) => {
              const st = statusBadge[inv.status] || statusBadge.pending;
              const ndas = inv.nda_count?.[0]?.count ?? 0;
              const eois = inv.eoi_count?.[0]?.count ?? 0;
              return (
                <div key={inv.id} className="bg-midnight-soft rounded-[var(--radius-md)] border border-midnight-elev p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{inv.full_name}</p>
                      <p className="text-xs text-gray-400">
                        {inv.company || "—"} · {inv.country || "—"} · {typeLabels[inv.investor_type || ""] || "—"}
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{ndas} NDA</span>
                      <span>{eois} EOI</span>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                    {inv.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleInvestorStatus(inv.id, "approved")}
                          className="text-xs px-3 py-1 bg-success/20 text-success rounded-full hover:bg-success/30 transition-colors cursor-pointer">
                          Approuver
                        </button>
                        <button onClick={() => handleInvestorStatus(inv.id, "rejected")}
                          className="text-xs px-3 py-1 bg-error/20 text-error rounded-full hover:bg-error/30 transition-colors cursor-pointer">
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev">
              Aucun investisseur inscrit.
            </div>
          )}
        </div>
      )}

      {/* Request Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Demande d'accès">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Nom</p><p className="text-text font-medium">{selected.full_name}</p></div>
              <div><p className="text-gray-400 text-xs">Email</p><p className="text-text">{selected.email}</p></div>
              <div><p className="text-gray-400 text-xs">Téléphone</p><p className="text-text">{selected.phone || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Structure</p><p className="text-text">{selected.company || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Pays</p><p className="text-text">{selected.country || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Type</p><p className="text-text">{typeLabels[selected.investor_type || ""] || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Ticket min</p><p className="text-text">{selected.ticket_min || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Financement</p><p className="text-text">{selected.preferred_deal_type || "—"}</p></div>
            </div>
            {selected.sectors_of_interest && selected.sectors_of_interest.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs mb-1">Secteurs d&apos;intérêt</p>
                <div className="flex flex-wrap gap-1">
                  {selected.sectors_of_interest.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {selected.referral_source && (
              <div><p className="text-gray-400 text-xs">Source</p><p className="text-sm text-text">{selected.referral_source}</p></div>
            )}

            {selected.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button onClick={() => handleApproveAndInvite(selected.id)} loading={inviting} className="flex-1">
                  Approuver &amp; inviter
                </Button>
                <Button variant="ghost" onClick={() => handleReject(selected.id)} className="flex-1">
                  Refuser
                </Button>
              </div>
            )}
            {selected.status !== "pending" && (
              <Badge variant={statusBadge[selected.status]?.variant || "default"}>
                {statusBadge[selected.status]?.label || selected.status}
              </Badge>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
