"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { verifyInvitation, createInvitedAccount } from "./actions";

export function InvitationClient() {
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
        setError("Lien d'invitation invalide.");
        setLoading(false);
        return;
      }
      const result = await verifyInvitation(token);
      if (result.valid && result.invitation) {
        setEmail(result.invitation.email);
        setFullName(result.invitation.access_requests?.full_name || "");
        setValid(true);
      } else {
        setError("Ce lien d'invitation est invalide ou a expiré.");
      }
      setLoading(false);
    }
    check();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
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
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <AuthLayout title="Vérification..." subtitle="Validation de votre invitation.">
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
      <AuthLayout title="Invitation invalide" subtitle="">
        <Alert variant="error">{error || "Ce lien n'est plus valide."}</Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Créer votre compte"
      subtitle={`Bienvenue ${fullName}, finalisez votre accès à WINVA.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          disabled
          className="opacity-60"
        />

        <Input
          id="password"
          label="Choisissez un mot de passe"
          type="password"
          placeholder="Minimum 8 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Créer mon compte
        </Button>
      </form>
    </AuthLayout>
  );
}
