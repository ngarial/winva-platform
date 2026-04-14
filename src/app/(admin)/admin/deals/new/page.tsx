"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createDeal } from "../actions";

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createDeal(formData);
      router.push("/admin/deals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-semibold text-white">Créer un deal</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <Input id="title" name="title" label="Titre du deal" required placeholder="Ex: Agro-transformation — Cacao" className="!bg-midnight-soft !border-midnight-elev !text-white" />

        <div className="grid grid-cols-2 gap-4">
          <Input id="sector" name="sector" label="Secteur" required placeholder="Ex: Agro-industrie" className="!bg-midnight-soft !border-midnight-elev !text-white" />
          <Input id="country" name="country" label="Pays" required placeholder="Côte d'Ivoire" defaultValue="Côte d'Ivoire" className="!bg-midnight-soft !border-midnight-elev !text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input id="revenue_range" name="revenue_range" label="CA indicatif" placeholder="Ex: 2-5 Mds FCFA" className="!bg-midnight-soft !border-midnight-elev !text-white" />
          <Input id="ticket_size" name="ticket_size" label="Ticket" placeholder="Ex: 500M - 1,5 Md FCFA" className="!bg-midnight-soft !border-midnight-elev !text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="deal_type"
            name="deal_type"
            label="Type"
            options={[
              { value: "equity", label: "Equity" },
              { value: "mezzanine", label: "Mezzanine" },
              { value: "debt", label: "Dette" },
            ]}
            className="!bg-midnight-soft !border-midnight-elev !text-white"
          />
          <Input id="stage" name="stage" label="Stade" placeholder="Ex: Série A, Croissance" className="!bg-midnight-soft !border-midnight-elev !text-white" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Description anonymisée du deal..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border bg-midnight-soft border-midnight-elev text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="status"
            name="status"
            label="Statut"
            options={[
              { value: "draft", label: "Brouillon" },
              { value: "active", label: "Actif (visible)" },
              { value: "closed", label: "Fermé" },
            ]}
            className="!bg-midnight-soft !border-midnight-elev !text-white"
          />
          <Select
            id="visibility"
            name="visibility"
            label="Visibilité"
            options={[
              { value: "public", label: "Public (tous les investisseurs)" },
              { value: "private", label: "Privé (accès sélectif)" },
            ]}
            className="!bg-midnight-soft !border-midnight-elev !text-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            Créer le deal
          </Button>
        </div>
      </form>
    </div>
  );
}
