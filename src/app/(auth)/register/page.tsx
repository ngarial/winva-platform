"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tc = useTranslations("common");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("passwordMinError"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "sme",
          company,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/verify-email");
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="bg-ivory-warm rounded-[var(--radius-md)] p-3 text-sm text-text-soft">
          <strong className="text-text">{t("investorBannerLead")}</strong>{" "}
          <Link href="/demande-acces" className="text-terracotta hover:text-terracotta-dark font-medium">
            {t("investorBannerLink")}
          </Link>
        </div>

        <Input
          id="fullName"
          label={t("fullNameLabel")}
          type="text"
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          id="company"
          label={t("companyLabel")}
          type="text"
          placeholder={t("companyPlaceholder")}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

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

        <Input
          id="password"
          label={t("passwordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />

        <Button type="submit" loading={loading} className="w-full">
          {t("submit")}
        </Button>
      </form>

      <p className="text-center text-sm text-text-soft">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
        >
          {t("signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}
