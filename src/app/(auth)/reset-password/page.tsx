"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
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
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation."
    >
      {success ? (
        <div className="space-y-6">
          <Alert variant="success">
            Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
          </Alert>
          <p className="text-center text-sm text-text-soft">
            <Link
              href="/login"
              className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              Retour à la connexion
            </Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <Alert variant="error">{error}</Alert>}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button type="submit" loading={loading} className="w-full">
              Envoyer le lien
            </Button>
          </form>

          <p className="text-center text-sm text-text-soft">
            <Link
              href="/login"
              className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              Retour à la connexion
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
