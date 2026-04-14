"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/admin/file-upload";
import { updateDeal, uploadDataroomFile, deleteDataroomFile, grantDealAccess, revokeDealAccess } from "../actions";

interface Deal {
  id: string;
  title: string;
  sector: string;
  country: string;
  revenue_range: string | null;
  ticket_size: string | null;
  deal_type: string;
  stage: string | null;
  description: string;
  status: string;
  visibility: string;
}

interface DataroomFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
}

interface AccessItem {
  id: string;
  investor_id: string;
  profiles: { full_name: string; company: string | null } | null;
}

interface Investor {
  id: string;
  full_name: string;
  company: string | null;
}

interface Props {
  deal: Deal;
  files: DataroomFile[];
  accessList: AccessItem[];
  investors: Investor[];
}

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function EditDealClient({ deal, files, accessList, investors }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState("");

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateDeal(deal.id, formData);
      setSuccess("Deal mis à jour");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
    setLoading(false);
  }

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await uploadDataroomFile(deal.id, formData);
    router.refresh();
  }

  async function handleDeleteFile(fileId: string, filePath: string) {
    await deleteDataroomFile(fileId, filePath, deal.id);
    router.refresh();
  }

  async function handleGrantAccess() {
    if (!selectedInvestor) return;
    await grantDealAccess(deal.id, selectedInvestor);
    setSelectedInvestor("");
    router.refresh();
  }

  async function handleRevokeAccess(investorId: string) {
    await revokeDealAccess(deal.id, investorId);
    router.refresh();
  }

  // Filter out investors who already have access
  const accessIds = new Set(accessList.map((a) => a.investor_id));
  const availableInvestors = investors.filter((i) => !accessIds.has(i.id));

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/admin/deals" className="text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 className="font-display text-2xl font-semibold text-white">{deal.title}</h1>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Edit form */}
      <form onSubmit={handleUpdate} className="space-y-5 bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev p-6">
        <h2 className="font-display text-lg font-semibold text-white">Informations du deal</h2>

        <Input id="title" name="title" label="Titre" required defaultValue={deal.title} className="!bg-midnight !border-midnight-elev !text-white" />
        <div className="grid grid-cols-2 gap-4">
          <Input id="sector" name="sector" label="Secteur" required defaultValue={deal.sector} className="!bg-midnight !border-midnight-elev !text-white" />
          <Input id="country" name="country" label="Pays" required defaultValue={deal.country} className="!bg-midnight !border-midnight-elev !text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="revenue_range" name="revenue_range" label="CA indicatif" defaultValue={deal.revenue_range || ""} className="!bg-midnight !border-midnight-elev !text-white" />
          <Input id="ticket_size" name="ticket_size" label="Ticket" defaultValue={deal.ticket_size || ""} className="!bg-midnight !border-midnight-elev !text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select id="deal_type" name="deal_type" label="Type" defaultValue={deal.deal_type} options={[
            { value: "equity", label: "Equity" },
            { value: "mezzanine", label: "Mezzanine" },
            { value: "debt", label: "Dette" },
          ]} className="!bg-midnight !border-midnight-elev !text-white" />
          <Input id="stage" name="stage" label="Stade" defaultValue={deal.stage || ""} className="!bg-midnight !border-midnight-elev !text-white" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
          <textarea id="description" name="description" required rows={4} defaultValue={deal.description}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border bg-midnight border-midnight-elev text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select id="status" name="status" label="Statut" defaultValue={deal.status} options={[
            { value: "draft", label: "Brouillon" },
            { value: "active", label: "Actif" },
            { value: "closed", label: "Fermé" },
          ]} className="!bg-midnight !border-midnight-elev !text-white" />
          <Select id="visibility" name="visibility" label="Visibilité" defaultValue={deal.visibility} options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Privé" },
          ]} className="!bg-midnight !border-midnight-elev !text-white" />
        </div>
        <Button type="submit" loading={loading}>Sauvegarder</Button>
      </form>

      {/* Dataroom */}
      <div className="bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-white">Dataroom</h2>
        <FileUpload onUpload={handleFileUpload} />
        {files.length > 0 && (
          <div className="space-y-2 mt-4">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 bg-midnight rounded-[var(--radius-md)] px-4 py-2">
                <p className="flex-1 text-sm text-gray-300 truncate">{f.file_name}</p>
                <span className="text-xs text-gray-500">{formatSize(f.file_size)}</span>
                <button
                  onClick={() => handleDeleteFile(f.id, f.file_path)}
                  className="text-gray-500 hover:text-error transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Access control (only for private deals) */}
      {deal.visibility === "private" && (
        <div className="bg-midnight-soft rounded-[var(--radius-lg)] border border-midnight-elev p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">Accès sélectif</h2>
          <p className="text-sm text-gray-400">Ce deal est privé. Seuls les investisseurs ci-dessous y ont accès.</p>

          <div className="flex gap-2">
            <select
              value={selectedInvestor}
              onChange={(e) => setSelectedInvestor(e.target.value)}
              className="flex-1 px-4 py-2 rounded-[var(--radius-md)] bg-midnight border border-midnight-elev text-white text-sm"
            >
              <option value="">Sélectionner un investisseur...</option>
              {availableInvestors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.full_name} {inv.company ? `(${inv.company})` : ""}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleGrantAccess} disabled={!selectedInvestor}>
              Ajouter
            </Button>
          </div>

          {accessList.length > 0 && (
            <div className="space-y-2">
              {accessList.map((access) => (
                <div key={access.id} className="flex items-center gap-3 bg-midnight rounded-[var(--radius-md)] px-4 py-2">
                  <p className="flex-1 text-sm text-gray-300">
                    {access.profiles?.full_name || "Investisseur"}
                    {access.profiles?.company && (
                      <span className="text-gray-500 ml-2">({access.profiles.company})</span>
                    )}
                  </p>
                  <button
                    onClick={() => handleRevokeAccess(access.investor_id)}
                    className="text-xs text-gray-500 hover:text-error transition-colors cursor-pointer"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
