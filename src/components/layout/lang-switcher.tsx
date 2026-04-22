"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function switchTo(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <button
        type="button"
        onClick={() => switchTo("fr")}
        className={`cursor-pointer transition-colors ${
          locale === "fr"
            ? "text-terracotta font-bold"
            : "text-gray-400 hover:text-text"
        }`}
      >
        FR
      </button>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`cursor-pointer transition-colors ${
          locale === "en"
            ? "text-terracotta font-bold"
            : "text-gray-400 hover:text-text"
        }`}
      >
        EN
      </button>
    </div>
  );
}
