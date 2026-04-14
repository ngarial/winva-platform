"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
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
      setError("Le mot de passe doit contenir au moins 8 caractères.");
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
    <AuthLayout
      title="Créer un compte PME"
      subtitle="Soumettez votre entreprise au financement WINVA."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="bg-ivory-warm rounded-[var(--radius-md)] p-3 text-sm text-text-soft">
          <strong className="text-text">Vous êtes investisseur ?</strong>{" "}
          <Link href="/demande-acces" className="text-terracotta hover:text-terracotta-dark font-medium">
            Demandez l&apos;accès au réseau &rarr;
          </Link>
        </div>

        <Input
          id="fullName"
          label="Nom complet"
          type="text"
          placeholder="Prénom Nom"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          id="company"
          label="Nom de l'entreprise"
          type="text"
          placeholder="Ex: Ma Startup SARL"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

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

        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="Minimum 8 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />

        <Button type="submit" loading={loading} className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-text-soft">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
