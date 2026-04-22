"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LangSwitcher } from "./lang-switcher";

interface AdminLayoutProps {
  children: React.ReactNode;
  userName: string;
}

type AdminNavItem = {
  href: string;
  labelKey: "dashboard" | "deals" | "investors" | "applications";
  exact?: boolean;
  icon: React.ReactElement;
};

const navItems: AdminNavItem[] = [
  {
    href: "/admin",
    labelKey: "dashboard",
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    href: "/admin/deals",
    labelKey: "deals",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/admin/investors",
    labelKey: "investors",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/applications",
    labelKey: "applications",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export function AdminLayout({ children, userName }: AdminLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("adminLayout");
  const tn = useTranslations("adminLayout.nav");

  return (
    <div className="min-h-screen bg-midnight flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-midnight-soft border-r border-midnight-elev fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-midnight-elev">
          <div className="flex items-center gap-2">
            <svg className="w-9 h-9 text-terracotta" viewBox="0 0 48 50" fill="currentColor">
              <path d="M4 8 L18 0 L18 20 L32 10 L32 30 L18 40 L18 20 L4 28 Z" opacity="0.5"/>
              <path d="M16 20 L30 12 L30 32 L44 22 L44 42 L30 50 L30 32 L16 40 Z"/>
            </svg>
            <div>
              <span className="font-body font-bold text-lg text-white block leading-tight tracking-wide">WINVA</span>
              <span className="text-xs text-terracotta font-medium">{t("administration")}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-terracotta/15 text-terracotta"
                    : "text-gray-400 hover:text-white hover:bg-midnight-elev"
                }`}
              >
                {item.icon}
                {tn(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-midnight-elev">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("investorSpace")}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-midnight-soft border-b border-midnight-elev sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm text-gray-400">
              {t("adminLabel")} <span className="font-medium text-white">{userName}</span>
            </h2>
            <div className="flex items-center gap-4">
              <LangSwitcher />
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-terracotta transition-colors cursor-pointer"
                >
                  {t("signOut")}
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
