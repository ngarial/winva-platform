"use client";

import { Select } from "@/components/ui/select";

interface DealFiltersProps {
  filters: {
    sector: string;
    country: string;
    dealType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  sectors: string[];
  countries: string[];
}

export function DealFilters({ filters, onFilterChange, sectors, countries }: DealFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        id="sector"
        placeholder="Tous les secteurs"
        value={filters.sector}
        onChange={(e) => onFilterChange("sector", e.target.value)}
        options={sectors.map((s) => ({ value: s, label: s }))}
      />
      <Select
        id="country"
        placeholder="Tous les pays"
        value={filters.country}
        onChange={(e) => onFilterChange("country", e.target.value)}
        options={countries.map((c) => ({ value: c, label: c }))}
      />
      <Select
        id="dealType"
        placeholder="Tous les types"
        value={filters.dealType}
        onChange={(e) => onFilterChange("dealType", e.target.value)}
        options={[
          { value: "equity", label: "Equity" },
          { value: "mezzanine", label: "Mezzanine" },
          { value: "debt", label: "Dette" },
        ]}
      />
    </div>
  );
}
