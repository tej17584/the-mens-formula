import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getContactMessages, getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  await requireAdmin();
  const [stats, latestMessages] = await Promise.all([
    getDashboardStats(),
    getContactMessages(1),
  ]);
  const recent = latestMessages.messages.slice(0, 3);
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
  const shortcuts = [
    {
      href: "/dashboard/products",
      title: translate("dashboard.products"),
      description: translate("dashboard.productsSubtitle"),
    },
    {
      href: "/dashboard/contact",
      title: translate("dashboard.messages"),
      description: translate("dashboard.messagesSubtitle"),
    },
    {
      href: "/dashboard/catalog",
      title: translate("dashboard.catalogManagement"),
      description: translate("dashboard.catalogManagementDescription"),
    },
    {
      href: "/dashboard/settings",
      title: translate("dashboard.settings"),
      description: translate("dashboard.settingsSubtitle"),
    },
  ];

  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-heading-row">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.welcome")}</h1>
          <p>{translate("dashboard.overview")}</p>
        </div>
        <Link className="button button-primary" href="/dashboard/products/new">
          {translate("dashboard.newProduct")}
        </Link>
      </header>
      <section
        className="dashboard-metric-grid"
        aria-label={translate("dashboard.operationalSummary")}
      >
        {cards.map((card) => (
          <Link href={card.href} key={card.label}>
            <Card className="dashboard-stat-card">
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="dashboard-stat-value">
                  {card.value}
                </CardTitle>
                <span className="dashboard-stat-link">{card.action} →</span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
      <div className="dashboard-home-split">
        <section
          className="dashboard-shortcut-grid"
          aria-label={translate("dashboard.quickAccess")}
        >
          {shortcuts.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="dashboard-shortcut-card">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>
        <section className="dashboard-recent-panel" aria-labelledby="recent-messages">
          <header>
            <div>
              <p className="eyebrow">{translate("dashboard.messages")}</p>
              <h2 id="recent-messages">{translate("dashboard.recentMessages")}</h2>
            </div>
            <Link href="/dashboard/contact">
              {translate("dashboard.viewAllMessages")} →
            </Link>
          </header>
          {recent.length ? (
            <ul>
              {recent.map((message) => (
                <li key={message.id}>
                  <Link href="/dashboard/contact">
                    <strong>{message.name}</strong>
                    <span>{message.contact}</span>
                    <p>{message.message}</p>
                  </Link>
                  {message.status === "new" ? (
                    <em>{translate("dashboard.new")}</em>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">{translate("dashboard.noMessages")}</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
