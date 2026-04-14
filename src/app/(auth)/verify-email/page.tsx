import { AuthLayout } from "@/components/layout/auth-layout";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Vérifiez votre email"
      subtitle="Un lien de confirmation a été envoyé."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-gray-100 p-6 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-center text-text-soft">
            Consultez votre boîte de réception et cliquez sur le lien
            de confirmation pour activer votre compte.
          </p>
          <p className="text-center text-sm text-gray-400">
            Si vous ne trouvez pas l&apos;email, vérifiez vos spams.
          </p>
        </div>

        <p className="text-center text-sm text-text-soft">
          <Link
            href="/login"
            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
