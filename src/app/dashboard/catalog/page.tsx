import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CatalogReferenceManager } from "@/components/dashboard/catalog-reference-manager";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardReferences } from "@/lib/dashboard";

export default async function DashboardCatalogPage() {
  await requireAdmin();
  const references = await getDashboardReferences();
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-page-header">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.catalogManagement")}</h1>
          <p>{translate("dashboard.catalogManagementDescription")}</p>
        </div>
      </header>
      <CatalogReferenceManager
        brands={references.brands}
        categories={references.categories}
      />
    </DashboardLayout>
  );
}
