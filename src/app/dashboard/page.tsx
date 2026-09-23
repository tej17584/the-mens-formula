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
      href: "/dashboard/products",
      action: translate("dashboard.viewInventory"),
    },
    {
      label: translate("dashboard.visibleProducts"),
      value: stats.visible,
      href: "/dashboard/products?visible=true",
      action: translate("dashboard.viewInventory"),
    },
    {
      label: translate("dashboard.hiddenProducts"),
      value: Math.max(0, stats.total - stats.visible),
      href: "/dashboard/products?visible=false",
      action: translate("dashboard.viewInventory"),
    },
    {
      label: translate("dashboard.newMessages"),
      value: stats.unread,
      href: "/dashboard/contact?status=new",
      action: translate("dashboard.viewMessages"),
    },
  ];

  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-page-header dashboard-welcome-heading">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.welcome")}</h1>
          <p>{translate("dashboard.overview")}</p>
        </div>
      </header>
      <section
        className="dashboard-status-section"
        aria-label={translate("dashboard.operationalSummary")}
      >
        <div className="dashboard-metrics">
          {cards.map((card) => (
            <Link
              className="dashboard-metric"
              href={card.href}
              key={card.label}
            >
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>
                {card.action} <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="dashboard-quick-section"
        aria-labelledby="dashboard-shortcuts-title"
      >
        <div className="dashboard-section-heading">
          <p className="eyebrow">{translate("dashboard.quickAccess")}</p>
          <p id="dashboard-shortcuts-title">
            {translate("dashboard.quickAccessDescription")}
          </p>
        </div>
        <div className="dashboard-shortcuts">
          <Link href="/dashboard/products">
            <strong>{translate("dashboard.products")}</strong>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/dashboard/contact">
            <strong>{translate("dashboard.messages")}</strong>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            className="dashboard-settings-shortcut"
            href="/dashboard/catalog"
          >
            {translate("dashboard.catalogManagement")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
}
