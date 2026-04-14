import { AuthLayout } from "@/components/layout/auth-layout";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <AuthLayout
      title="Demande envoyée"
      subtitle="Nous avons bien reçu votre demande."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-gray-100 p-6 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-center font-display text-lg font-semibold text-midnight">
            Demande d&apos;accès enregistrée
          </h3>
          <p className="text-center text-text-soft text-sm leading-relaxed">
            Votre demande sera examinée par notre équipe sous <strong>48 heures</strong>.
            Si votre profil est retenu, vous recevrez un email d&apos;invitation
            avec un lien pour créer votre compte.
          </p>
          <div className="bg-ivory rounded-[var(--radius-md)] p-4 text-sm text-text-soft">
            <p className="font-medium text-text mb-2">Processus d&apos;admission :</p>
            <ul className="space-y-1">
              <li>1. Examen de votre profil investisseur</li>
              <li>2. Validation par l&apos;équipe WINVA</li>
              <li>3. Envoi de votre lien d&apos;invitation</li>
              <li>4. Création de votre compte et accès au deal flow</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-text-soft">
          <Link
            href="/login"
            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            Déjà un compte ? Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
