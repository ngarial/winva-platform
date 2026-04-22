"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")}>
      {success ? (
        <div className="space-y-6">
          <Alert variant="success">
            {t("successMessage")} <strong>{email}</strong>.
          </Alert>
          <p className="text-center text-sm text-text-soft">
            <Link
              href="/login"
              className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <Alert variant="error">{error}</Alert>}

            <Input
              id="email"
              label={t("emailLabel")}
              type="email"
              placeholder={tc("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button type="submit" loading={loading} className="w-full">
              {t("submit")}
            </Button>
          </form>

          <p className="text-center text-sm text-text-soft">
            <Link
              href="/login"
              className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              {t("backToLogin")}
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
