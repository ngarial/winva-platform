import { getTranslations } from "next-intl/server";
import { AuthLayout } from "@/components/layout/auth-layout";
import Link from "next/link";

export default async function ConfirmationPage() {
  const t = await getTranslations("accessRequest");
  return (
    <AuthLayout title={t("confirmationTitle")} subtitle={t("confirmationSubtitle")}>
      <div className="space-y-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-gray-100 p-6 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-center font-display text-lg font-semibold text-midnight">
            {t("confirmationHeading")}
          </h3>
          <p
            className="text-center text-text-soft text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.raw("confirmationBody") as string }}
          />
          <div className="bg-ivory rounded-[var(--radius-md)] p-4 text-sm text-text-soft">
            <p className="font-medium text-text mb-2">{t("processTitle")}</p>
            <ul className="space-y-1">
              <li>{t("processStep1")}</li>
              <li>{t("processStep2")}</li>
              <li>{t("processStep3")}</li>
              <li>{t("processStep4")}</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-text-soft">
          <Link
            href="/login"
            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors"
          >
            {t("alreadyAccount")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
