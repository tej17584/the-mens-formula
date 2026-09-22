import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { translate } from "@/i18n";

export function DashboardNav() {
  return (
    <aside className="dashboard-nav">
      <BrandLogo inverted />
      <p className="eyebrow">{translate("dashboard.title")}</p>
      <nav aria-label={translate("dashboard.title")}>
        <Link href="/dashboard">{translate("dashboard.welcome")}</Link>
        <Link href="/dashboard/products">
          {translate("dashboard.products")}
        </Link>
        <Link href="/dashboard/contact">{translate("dashboard.messages")}</Link>
        <Link href="/dashboard/settings">
          {translate("dashboard.settings")}
        </Link>
      </nav>
      <Link className="text-link" href="/catalogo">
        {translate("common.backToCatalog")} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
