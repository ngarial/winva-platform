"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { submitAccessRequest } from "./actions";

const SECTORS = [
  "Agriculture / Agro",
  "Industrie / BTP",
  "Services",
  "Technologie",
  "Commerce",
  "Tous secteurs",
];

export default function DemandeAccesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  function toggleSector(sector: string) {
    if (sector === "Tous secteurs") {
      setSelectedSectors(selectedSectors.includes("Tous secteurs") ? [] : ["Tous secteurs"]);
      return;
    }
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector && s !== "Tous secteurs")
        : [...prev.filter((s) => s !== "Tous secteurs"), sector]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // Add sectors manually since they're checkboxes managed in state
      selectedSectors.forEach((s) => formData.append("sectors", s));
      await submitAccessRequest(formData);
      router.push("/demande-acces/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Rejoindre le réseau"
      subtitle="Votre demande sera examinée sous 48h."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-2 gap-3">
          <Input id="full_name" name="full_name" label="Nom complet" required placeholder="Prénom et nom" />
          <Input id="email" name="email" type="email" label="Email" required placeholder="email@exemple.com" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="phone" name="phone" type="tel" label="Téléphone" required placeholder="+225 XX XX XX XX XX" />
          <Input id="company" name="company" label="Structure / Organisation" placeholder="Nom du fonds ou de la structure" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="country" name="country" label="Pays de résidence" defaultValue="Côte d'Ivoire" />
          <Select
            id="investor_type"
            name="investor_type"
            label="Type d'investisseur"
            placeholder="Sélectionnez un type"
            options={[
              { value: "pe-vc", label: "Private Equity / VC" },
              { value: "family-office", label: "Family Office" },
              { value: "business-angel", label: "Business Angel" },
              { value: "diaspora", label: "Investisseur Diaspora" },
              { value: "impact", label: "Impact Investor" },
              { value: "institutionnel", label: "Institutionnel" },
              { value: "autre", label: "Autre" },
            ]}
          />
        </div>

        {/* Sectors of interest */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Secteurs d&apos;intérêt</label>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => toggleSector(sector)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  selectedSectors.includes(sector)
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-gray-200 text-text-soft hover:border-gray-300"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="ticket_min"
            name="ticket_min"
            label="Ticket minimum (FCFA)"
            placeholder="Sélectionnez"
            options={[
              { value: "< 25M", label: "< 25 millions" },
              { value: "25-50M", label: "25 - 50 millions" },
              { value: "50-100M", label: "50 - 100 millions" },
              { value: "100-500M", label: "100 - 500 millions" },
              { value: "> 500M", label: "> 500 millions" },
            ]}
          />
          <Select
            id="preferred_deal_type"
            name="preferred_deal_type"
            label="Type de financement préféré"
            placeholder="Sélectionnez"
            options={[
              { value: "equity", label: "Equity" },
              { value: "dette", label: "Dette" },
              { value: "hybride", label: "Hybride" },
              { value: "ouvert", label: "Ouvert à tout" },
            ]}
          />
        </div>

        <Select
          id="referral_source"
          name="referral_source"
          label="Comment avez-vous connu WINVA ?"
          placeholder="Sélectionnez"
          options={[
            { value: "bouche-a-oreille", label: "Bouche à oreille" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "evenement", label: "Événement" },
            { value: "partenaire", label: "Partenaire" },
            { value: "autre", label: "Autre" },
          ]}
        />

        <Button type="submit" loading={loading} className="w-full">
          Demander l&apos;accès
        </Button>
      </form>
    </AuthLayout>
  );
}
