import { AuthLayout } from "@/components/layout/auth-layout";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <AuthLayout
      title="Candidature envoyée"
      subtitle="Merci pour votre soumission."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-gray-100 p-6 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-center font-display text-lg font-semibold text-midnight">
            Votre candidature a bien été reçue
          </h3>
          <p className="text-center text-text-soft text-sm leading-relaxed">
            L&apos;équipe WINVA examinera votre dossier dans les meilleurs délais.
            Vous recevrez un email de confirmation à l&apos;adresse indiquée.
          </p>
          <div className="bg-ivory rounded-[var(--radius-md)] p-4 text-sm text-text-soft">
            <p className="font-medium text-text mb-2">Prochaines étapes :</p>
            <ul className="space-y-1">
              <li>1. Analyse de votre dossier par notre équipe</li>
              <li>2. Entretien préliminaire si éligible</li>
              <li>3. Préparation au financement</li>
              <li>4. Mise en relation avec nos investisseurs</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-text-soft">
          <Link
            href="/login"
            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            Se connecter
          </Link>
          {" · "}
          <Link
            href="/register"
            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
