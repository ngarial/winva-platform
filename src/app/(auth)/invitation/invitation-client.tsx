"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { verifyInvitation, createInvitedAccount } from "./actions";

export function InvitationClient() {
  const t = useTranslations("auth.invitation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    async function check() {
      if (!token) {
        setError(t("invalidLink"));
        setLoading(false);
        return;
      }
      const result = await verifyInvitation(token);
      if (result.valid && result.invitation) {
        setEmail(result.invitation.email);
        setFullName(result.invitation.access_requests?.full_name || "");
        setValid(true);
      } else {
        setError(t("expiredLink"));
      }
      setLoading(false);
    }
    check();
  }, [token, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("passwordMinError"));
      return;
    }

    setSubmitting(true);

    try {
      const result = await createInvitedAccount(token, password);

      // Sign in automatically
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: result.email,
        password,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <AuthLayout title={t("verifying")} subtitle={t("verifyingSubtitle")}>
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-terracotta" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </AuthLayout>
    );
  }

  if (!valid) {
    return (
      <AuthLayout title={t("invalidTitle")} subtitle="">
        <Alert variant="error">{error || t("noLongerValid")}</Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("title")} subtitle={t("subtitle", { name: fullName })}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="email"
          label={t("emailLabel")}
          type="email"
          value={email}
          disabled
          className="opacity-60"
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

        <Button type="submit" loading={submitting} className="w-full">
          {t("submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
