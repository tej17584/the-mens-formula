import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();
  const cards = [
    [translate("dashboard.totalProducts"), stats.total],
    [translate("dashboard.visibleProducts"), stats.visible],
    [
      translate("dashboard.hiddenProducts"),
      Math.max(0, stats.total - stats.visible),
    ],
    [translate("dashboard.newMessages"), stats.unread],
  ];
  return (
    <DashboardLayout>
      <header className="dashboard-heading">
        <p className="eyebrow">{translate("dashboard.title")}</p>
        <h1>{translate("dashboard.welcome")}</h1>
        <p>{translate("dashboard.overview")}</p>
      </header>
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
      <div className="dashboard-stats">
        {cards.map(([label, value]) => (
          <article key={String(label)}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
