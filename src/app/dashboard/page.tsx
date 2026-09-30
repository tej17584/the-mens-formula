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
      <header className="dashboard-heading">
        <p className="eyebrow">{translate("dashboard.title")}</p>
        <h1>{translate("dashboard.welcome")}</h1>
        <p>{translate("dashboard.overview")}</p>
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
      <section className="dashboard-shortcut-grid">
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
    </DashboardLayout>
  );
}
