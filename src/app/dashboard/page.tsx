import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();
  const cards = [
    {
      label: translate("dashboard.totalProducts"),
      value: stats.total,
      tone: "all",
    },
    {
      label: translate("dashboard.visibleProducts"),
      value: stats.visible,
      tone: "live",
    },
    {
      label: translate("dashboard.hiddenProducts"),
      value: Math.max(0, stats.total - stats.visible),
      tone: "hidden",
    },
    {
      label: translate("dashboard.newMessages"),
      value: stats.unread,
      tone: "messages",
    },
  ];
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-welcome-heading">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.welcome")}</h1>
          <p>{translate("dashboard.overview")}</p>
        </div>
        <div className="dashboard-welcome-signal" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </header>
      <div className="dashboard-overview-layout">
        <section aria-labelledby="dashboard-shortcuts-title">
          <div className="dashboard-section-heading">
            <p className="eyebrow">{translate("dashboard.quickAccess")}</p>
            <p id="dashboard-shortcuts-title">
              {translate("dashboard.quickAccessDescription")}
            </p>
          </div>
          <div className="dashboard-shortcuts">
            <Link href="/dashboard/products">
              <strong>{translate("dashboard.products")}</strong>
              <span>→</span>
            </Link>
            <Link href="/dashboard/contact">
              <strong>{translate("dashboard.messages")}</strong>
              <span>→</span>
            </Link>
          </div>
        </section>
        <aside className="dashboard-overview-note">
          <p className="eyebrow">{translate("dashboard.operation")}</p>
          <p>{translate("dashboard.operationDescription")}</p>
          <Link className="text-link" href="/dashboard/settings">
            {translate("dashboard.openSettings")}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
      <section
        className="dashboard-status-section"
        aria-labelledby="status-title"
      >
        <div className="dashboard-section-heading">
          <p className="eyebrow">{translate("dashboard.operationalSummary")}</p>
          <p id="status-title">
            {translate("dashboard.operationalSummaryDescription")}
          </p>
        </div>
        <div className="dashboard-metrics">
          {cards.map((card) => (
            <article
              className={`dashboard-metric dashboard-metric-${card.tone}`}
              key={card.label}
            >
              <p>{card.label}</p>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
