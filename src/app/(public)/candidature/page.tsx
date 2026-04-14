"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { submitApplication } from "./actions";

export default function CandidaturePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await submitApplication(formData);
      router.push("/candidature/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Candidature PME"
      subtitle="Soumettez votre entreprise pour accéder au financement."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="company_name"
          name="company_name"
          label="Nom de l'entreprise"
          required
          placeholder="Ex: Ma Startup SARL"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="sector"
            name="sector"
            label="Secteur"
            placeholder="Sélectionner..."
            options={[
              { value: "Agro-industrie", label: "Agro-industrie" },
              { value: "Technologies financières", label: "Fintech" },
              { value: "Santé", label: "Santé" },
              { value: "Immobilier", label: "Immobilier" },
              { value: "Transport & Logistique", label: "Transport & Logistique" },
              { value: "Énergie", label: "Énergie" },
              { value: "Éducation", label: "Éducation" },
              { value: "Commerce", label: "Commerce" },
              { value: "Industrie", label: "Industrie" },
              { value: "Autre", label: "Autre" },
            ]}
          />
          <Input
            id="country"
            name="country"
            label="Pays"
            required
            defaultValue="Côte d'Ivoire"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="revenue"
            name="revenue"
            label="Chiffre d'affaires"
            placeholder="Ex: 500M FCFA"
          />
          <Input
            id="funding_need"
            name="funding_need"
            label="Besoin de financement"
            placeholder="Ex: 200M - 500M FCFA"
          />
        </div>

        <Input
          id="contact_name"
          name="contact_name"
          label="Nom du contact"
          required
          placeholder="Prénom Nom"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="contact_email"
            name="contact_email"
            label="Email"
            type="email"
            required
            placeholder="contact@entreprise.com"
          />
          <Input
            id="contact_phone"
            name="contact_phone"
            label="Téléphone"
            type="tel"
            placeholder="+225 XX XX XX XX"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-text">
            Description de l&apos;entreprise
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Décrivez votre activité, votre historique, et votre projet de financement..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-gray-200 bg-white text-text placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Soumettre ma candidature
        </Button>
      </form>
    </AuthLayout>
  );
}
