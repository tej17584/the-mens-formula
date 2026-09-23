"use client";

import { useTranslations } from "@/i18n";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardCatalogError() {
  const t = useTranslations();

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardNav />
        <section className="dashboard-main">
          <div className="dashboard-heading dashboard-page-header">
            <p className="eyebrow">{t("dashboard.title")}</p>
            <h1>{t("dashboard.actionRefreshTitle")}</h1>
            <p>{t("dashboard.actionRefreshDescription")}</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => window.location.reload()}
            >
              {t("dashboard.actionRefresh")}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
