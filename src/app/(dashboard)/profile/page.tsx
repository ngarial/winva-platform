import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const roleLabels: Record<string, string> = {
    admin: "Administrateur WINVA",
    investor: "Investisseur",
    sme: "PME / Entrepreneur",
  };

  const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
    pending: { label: "En attente de validation", variant: "warning" },
    approved: { label: "Approuvé", variant: "success" },
    rejected: { label: "Refusé", variant: "default" },
  };

  const status = statusLabels[profile?.status || "pending"] || statusLabels.pending;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-midnight">
          Mon profil
        </h1>
        <p className="text-text-soft mt-1">
          Vos informations personnelles.
        </p>
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
              <Badge variant="terracotta">{roleLabels[profile?.role || "investor"]}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="text-sm text-text mt-0.5">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Structure</p>
            <p className="text-sm text-text mt-0.5">{profile?.company || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Pays</p>
            <p className="text-sm text-text mt-0.5">{profile?.country || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Téléphone</p>
            <p className="text-sm text-text mt-0.5">{profile?.phone || "—"}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Membre depuis le {new Date(profile?.created_at || Date.now()).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </Card>
    </div>
  );
}
