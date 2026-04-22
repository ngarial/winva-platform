import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const t = await getTranslations("profile");
  const locale = await getLocale();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const statusMeta: Record<string, { key: "pending" | "approved" | "rejected"; variant: "success" | "warning" | "default" }> = {
    pending: { key: "pending", variant: "warning" },
    approved: { key: "approved", variant: "success" },
    rejected: { key: "rejected", variant: "default" },
  };

  const status = statusMeta[profile?.status || "pending"] || statusMeta.pending;
  const roleKey = (profile?.role || "investor") as "admin" | "investor" | "sme";
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";
  const memberDate = new Date(profile?.created_at || Date.now()).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          {t("title")}
        </h1>
        <p className="text-text-soft mt-1">{t("subtitle")}</p>
      </div>

      <Card className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center">
            <span className="text-terracotta font-display font-bold text-2xl">
              {(profile?.full_name || "?")[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-midnight">
              {profile?.full_name || "—"}
            </h2>
            <div className="flex gap-2 mt-1">
              <Badge variant="terracotta">{t(`roles.${roleKey}`)}</Badge>
              <Badge variant={status.variant}>{t(`statuses.${status.key}`)}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t("email")}</p>
            <p className="text-sm text-text mt-0.5">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t("structure")}</p>
            <p className="text-sm text-text mt-0.5">{profile?.company || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t("country")}</p>
            <p className="text-sm text-text mt-0.5">{profile?.country || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t("phone")}</p>
            <p className="text-sm text-text mt-0.5">{profile?.phone || "—"}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          {t("memberSince", { date: memberDate })}
        </p>
      </Card>
    </div>
  );
}
