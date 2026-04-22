"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { submitAccessRequest } from "./actions";

const SECTOR_KEYS = ["agro", "industry", "services", "tech", "commerce", "all"] as const;
type SectorKey = (typeof SECTOR_KEYS)[number];

// Canonical sector values (stored in DB). These remain in French for backend consistency.
const SECTOR_VALUES: Record<SectorKey, string> = {
  agro: "Agriculture / Agro",
  industry: "Industrie / BTP",
  services: "Services",
  tech: "Technologie",
  commerce: "Commerce",
  all: "Tous secteurs",
};

export default function DemandeAccesPage() {
  const t = useTranslations("accessRequest");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  function toggleSector(sector: string) {
    if (sector === SECTOR_VALUES.all) {
      setSelectedSectors(selectedSectors.includes(SECTOR_VALUES.all) ? [] : [SECTOR_VALUES.all]);
      return;
    }
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector && s !== SECTOR_VALUES.all)
        : [...prev.filter((s) => s !== SECTOR_VALUES.all), sector]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      selectedSectors.forEach((s) => formData.append("sectors", s));
      await submitAccessRequest(formData);
      router.push("/demande-acces/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    }
    setLoading(false);
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid grid-cols-2 gap-3">
          <Input id="full_name" name="full_name" label={t("fullName")} required placeholder={t("fullNamePlaceholder")} />
          <Input id="email" name="email" type="email" label={t("email")} required placeholder={t("emailPlaceholder")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="phone" name="phone" type="tel" label={t("phone")} required placeholder={t("phonePlaceholder")} />
          <Input id="company" name="company" label={t("company")} placeholder={t("companyPlaceholder")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input id="country" name="country" label={t("country")} defaultValue="Côte d'Ivoire" />
          <Select
            id="investor_type"
            name="investor_type"
            label={t("investorType")}
            placeholder={t("investorTypePlaceholder")}
            options={[
              { value: "pe-vc", label: t("investorTypes.peVc") },
              { value: "family-office", label: t("investorTypes.familyOffice") },
              { value: "business-angel", label: t("investorTypes.businessAngel") },
              { value: "diaspora", label: t("investorTypes.diaspora") },
              { value: "impact", label: t("investorTypes.impact") },
              { value: "institutionnel", label: t("investorTypes.institutional") },
              { value: "autre", label: t("investorTypes.other") },
            ]}
          />
        </div>

        {/* Sectors of interest */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">{t("sectorsLabel")}</label>
          <div className="flex flex-wrap gap-2">
            {SECTOR_KEYS.map((key) => {
              const value = SECTOR_VALUES[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSector(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selectedSectors.includes(value)
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-gray-200 text-text-soft hover:border-gray-300"
                  }`}
                >
                  {t(`sectors.${key}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="ticket_min"
            name="ticket_min"
            label={t("ticketMin")}
            placeholder={t("ticketMinPlaceholder")}
            options={[
              { value: "< 25M", label: t("ticketMins.lt25") },
              { value: "25-50M", label: t("ticketMins.b25_50") },
              { value: "50-100M", label: t("ticketMins.b50_100") },
              { value: "100-500M", label: t("ticketMins.b100_500") },
              { value: "> 500M", label: t("ticketMins.gt500") },
            ]}
          />
          <Select
            id="preferred_deal_type"
            name="preferred_deal_type"
            label={t("dealType")}
            placeholder={t("dealTypePlaceholder")}
            options={[
              { value: "equity", label: t("dealTypes.equity") },
              { value: "dette", label: t("dealTypes.debt") },
              { value: "hybride", label: t("dealTypes.hybrid") },
              { value: "ouvert", label: t("dealTypes.open") },
            ]}
          />
        </div>

        <Select
          id="referral_source"
          name="referral_source"
          label={t("referralSource")}
          placeholder={t("referralSourcePlaceholder")}
          options={[
            { value: "bouche-a-oreille", label: t("referralSources.wordOfMouth") },
            { value: "linkedin", label: t("referralSources.linkedin") },
            { value: "evenement", label: t("referralSources.event") },
            { value: "partenaire", label: t("referralSources.partner") },
            { value: "autre", label: t("referralSources.other") },
          ]}
        />

        <Button type="submit" loading={loading} className="w-full">
          {t("submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
