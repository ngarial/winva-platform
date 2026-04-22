"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { submitApplication } from "./actions";

export default function CandidaturePage() {
  const t = useTranslations("application");
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
      setError(err instanceof Error ? err.message : t("genericError"));
    }
    setLoading(false);
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="company_name"
          name="company_name"
          label={t("companyName")}
          required
          placeholder={t("companyNamePlaceholder")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="sector"
            name="sector"
            label={t("sector")}
            placeholder={t("sectorPlaceholder")}
            options={[
              { value: "Agro-industrie", label: t("sectors.agroIndustry") },
              { value: "Technologies financières", label: t("sectors.fintech") },
              { value: "Santé", label: t("sectors.health") },
              { value: "Immobilier", label: t("sectors.realEstate") },
              { value: "Transport & Logistique", label: t("sectors.transport") },
              { value: "Énergie", label: t("sectors.energy") },
              { value: "Éducation", label: t("sectors.education") },
              { value: "Commerce", label: t("sectors.commerce") },
              { value: "Industrie", label: t("sectors.industry") },
              { value: "Autre", label: t("sectors.other") },
            ]}
          />
          <Input
            id="country"
            name="country"
            label={t("country")}
            required
            defaultValue="Côte d'Ivoire"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="revenue"
            name="revenue"
            label={t("revenue")}
            placeholder={t("revenuePlaceholder")}
          />
          <Input
            id="funding_need"
            name="funding_need"
            label={t("fundingNeed")}
            placeholder={t("fundingNeedPlaceholder")}
          />
        </div>

        <Input
          id="contact_name"
          name="contact_name"
          label={t("contactName")}
          required
          placeholder={t("contactNamePlaceholder")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="contact_email"
            name="contact_email"
            label={t("contactEmail")}
            type="email"
            required
            placeholder={t("contactEmailPlaceholder")}
          />
          <Input
            id="contact_phone"
            name="contact_phone"
            label={t("contactPhone")}
            type="tel"
            placeholder={t("contactPhonePlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-text">
            {t("description")}
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder={t("descriptionPlaceholder")}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-gray-200 bg-white text-text placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {t("submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
