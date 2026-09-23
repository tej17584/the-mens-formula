"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutDashboard } from "@/actions/auth";
import { BrandLogo } from "@/components/brand-logo";
import { useTranslations } from "@/i18n";

type IconName = "home" | "products" | "messages" | "catalog" | "settings";

function DashboardIcon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  if (name === "home")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>
        <path d="m3 10 9-7 9 7v10H3z" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  if (name === "products")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </svg>
    );
  if (name === "messages")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>
        <path d="M4 5h16v11H8l-4 3z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    );
  if (name === "catalog")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56v.1h-3v-.1a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.04 15 1.7 1.7 0 0 0 5.5 13.96h-.1v-3h.1A1.7 1.7 0 0 0 7.04 9.92 1.7 1.7 0 0 0 6.7 8.04l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.72 4.7v-.1h3v.1a1.7 1.7 0 0 0 1.04 1.58 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.1v3h-.1A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

export function DashboardNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links: { href: string; label: string; icon: IconName }[] = [
    { href: "/dashboard", label: t("dashboard.welcome"), icon: "home" },
    {
      href: "/dashboard/products",
      label: t("dashboard.products"),
      icon: "products",
    },
    {
      href: "/dashboard/contact",
      label: t("dashboard.messages"),
      icon: "messages",
    },
    {
      href: "/dashboard/catalog",
      label: t("dashboard.catalogManagement"),
      icon: "catalog",
    },
    {
      href: "/dashboard/settings",
      label: t("dashboard.settings"),
      icon: "settings",
    },
  ];
  return (
    <>
      <button
        aria-controls="dashboard-navigation"
        aria-expanded={open}
        aria-label={t("dashboard.openNavigation")}
        className="dashboard-menu-button"
        type="button"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {open ? (
        <button
          aria-label={t("dashboard.closeNavigation")}
          className="dashboard-nav-backdrop"
          type="button"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={["dashboard-nav", open && "is-open"]
          .filter(Boolean)
          .join(" ")}
        id="dashboard-navigation"
      >
        <div className="dashboard-nav-brand">
          <BrandLogo />
          <button
            aria-label={t("dashboard.closeNavigation")}
            className="dashboard-nav-close"
            type="button"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <p className="eyebrow">{t("dashboard.title")}</p>
        <nav aria-label={t("dashboard.title")}>
          {links.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                className={isActive ? "is-active" : undefined}
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                <DashboardIcon name={link.icon} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <Link className="dashboard-back-link" href="/catalogo">
          {t("common.backToCatalog")}
          <span aria-hidden="true">→</span>
        </Link>
        <form action={signOutDashboard} className="dashboard-sign-out">
          <button type="submit">{t("dashboard.signOut")}</button>
        </form>
      </aside>
    </>
  );
}
