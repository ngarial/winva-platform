"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface DealCardProps {
  id: string;
  title: string;
  sector: string;
  country: string;
  revenueRange: string | null;
  ticketSize: string | null;
  dealType: string;
  stage: string | null;
  description: string;
}

const dealTypeBadge: Record<string, { labelKey: "equity" | "mezzanine" | "debt"; variant: "terracotta" | "midnight" | "default" }> = {
  equity: { labelKey: "equity", variant: "terracotta" },
  mezzanine: { labelKey: "mezzanine", variant: "midnight" },
  debt: { labelKey: "debt", variant: "default" },
};

export function DealCard({
  id,
  title,
  sector,
  country,
  revenueRange,
  ticketSize,
  dealType,
  stage,
  description,
}: DealCardProps) {
  const t = useTranslations("deals");
  const typeInfo = dealTypeBadge[dealType] || dealTypeBadge.equity;
  const typeLabel = t(`badges.${typeInfo.labelKey}`);

  return (
    <Link
      href={`/deals/${id}`}
      className="block bg-white rounded-[var(--radius-lg)] border border-gray-100 shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-terracotta/20 group-hover:bg-terracotta transition-colors duration-300" />

      <div className="p-6 space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={typeInfo.variant}>{typeLabel}</Badge>
          <Badge variant="outline">{sector}</Badge>
          {stage && <Badge variant="default">{stage}</Badge>}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-midnight group-hover:text-terracotta transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-soft leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t("countryLabel")}</p>
            <p className="text-sm font-medium text-text mt-0.5">{country}</p>
          </div>
          {revenueRange && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{t("revenueLabel")}</p>
              <p className="text-sm font-medium text-text mt-0.5">{revenueRange}</p>
            </div>
          )}
          {ticketSize && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{t("ticketLabel")}</p>
              <p className="text-sm font-medium text-terracotta mt-0.5">{ticketSize}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center text-sm text-terracotta font-medium pt-2">
          {t("viewDetail")}
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
