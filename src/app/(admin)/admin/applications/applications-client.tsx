"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { updateApplicationStatus } from "./actions";

interface Application {
  id: string;
  company_name: string;
  sector: string;
  country: string;
  revenue: string | null;
  funding_need: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  description: string;
  status: string;
  created_at: string;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "default" | "terracotta" }> = {
  pending: { label: "Nouvelle", variant: "warning" },
  reviewed: { label: "En examen", variant: "terracotta" },
  accepted: { label: "Acceptée", variant: "success" },
  rejected: { label: "Refusée", variant: "default" },
};

export function ApplicationsClient({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Application | null>(null);

  async function handleStatus(id: string, status: "reviewed" | "accepted" | "rejected") {
    await updateApplicationStatus(id, status);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">Candidatures PME</h1>

      {applications.length > 0 ? (
        <div className="space-y-2">
          {applications.map((app) => {
            const st = statusBadge[app.status] || statusBadge.pending;
            return (
              <div
                key={app.id}
                className="bg-midnight-soft rounded-[var(--radius-md)] border border-midnight-elev p-4 hover:border-terracotta/30 transition-colors cursor-pointer"
                onClick={() => setSelected(app)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{app.company_name}</p>
                    <p className="text-xs text-gray-400">
                      {app.sector} · {app.country} · {app.contact_name}
                    </p>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                  <span className="text-xs text-gray-600">
                    {new Date(app.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev">
          Aucune candidature PME.
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.company_name}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Secteur</p><p className="text-text">{selected.sector}</p></div>
              <div><p className="text-gray-400 text-xs">Pays</p><p className="text-text">{selected.country}</p></div>
              <div><p className="text-gray-400 text-xs">CA</p><p className="text-text">{selected.revenue || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Besoin</p><p className="text-text">{selected.funding_need || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Contact</p><p className="text-text">{selected.contact_name}</p></div>
              <div><p className="text-gray-400 text-xs">Email</p><p className="text-text">{selected.contact_email}</p></div>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Description</p>
              <p className="text-sm text-text leading-relaxed">{selected.description}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { handleStatus(selected.id, "reviewed"); setSelected(null); }}
                className="text-xs px-3 py-1.5 bg-terracotta/20 text-terracotta rounded-full hover:bg-terracotta/30 transition-colors cursor-pointer">
                En examen
              </button>
              <button onClick={() => { handleStatus(selected.id, "accepted"); setSelected(null); }}
                className="text-xs px-3 py-1.5 bg-success/20 text-success rounded-full hover:bg-success/30 transition-colors cursor-pointer">
                Accepter
              </button>
              <button onClick={() => { handleStatus(selected.id, "rejected"); setSelected(null); }}
                className="text-xs px-3 py-1.5 bg-error/20 text-error rounded-full hover:bg-error/30 transition-colors cursor-pointer">
                Refuser
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
