"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DealCard } from "@/components/deals/deal-card";
import { DealFilters } from "@/components/deals/deal-filters";
import { Card } from "@/components/ui/card";

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
}

interface DealsPageClientProps {
  deals: Deal[];
  sectors: string[];
  countries: string[];
}

export function DealsPageClient({ deals, sectors, countries }: DealsPageClientProps) {
  const t = useTranslations("deals");
  const [filters, setFilters] = useState({
    sector: "",
    country: "",
    dealType: "",
  });
  const [search, setSearch] = useState("");

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = deals.filter((deal) => {
    if (filters.sector && deal.sector !== filters.sector) return false;
    if (filters.country && deal.country !== filters.country) return false;
    if (filters.dealType && deal.deal_type !== filters.dealType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        deal.title.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        deal.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          {t("listTitle")}
        </h1>
        <p className="text-text-soft mt-1">
          {deals.length > 1
            ? t("countOther", { count: deals.length })
            : t("countOne", { count: deals.length })}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-[var(--radius-md)] border border-gray-200 bg-white text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
        />
        <DealFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          sectors={sectors}
          countries={countries}
        />
      </div>

      {/* Deals grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              title={deal.title}
              sector={deal.sector}
              country={deal.country}
              revenueRange={deal.revenue_range}
              ticketSize={deal.ticket_size}
              dealType={deal.deal_type}
              stage={deal.stage}
              description={deal.description}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-text-soft">{t("noMatch")}</p>
          {(filters.sector || filters.country || filters.dealType || search) && (
            <button
              onClick={() => {
                setFilters({ sector: "", country: "", dealType: "" });
                setSearch("");
              }}
              className="text-sm text-terracotta hover:text-terracotta-dark font-medium mt-2 cursor-pointer"
            >
              {t("resetFilters")}
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
