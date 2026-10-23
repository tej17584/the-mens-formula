import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductForm } from "@/components/dashboard/product-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardReferences } from "@/lib/dashboard";
import { sanitizeDashboardReturnTo } from "@/lib/dashboard/products-list-query";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewProductPage({ searchParams }: PageProps) {
  await requireAdmin();
  const query = await searchParams;
  const returnTo = sanitizeDashboardReturnTo(query.returnTo);
  const references = await getDashboardReferences();
  return (
    <DashboardLayout>
      <div className="dashboard-page-toolbar">
        <DashboardBackLink
          href={returnTo}
          label={translate("dashboard.backToInventory")}
        />
      </div>
      <header className="dashboard-heading dashboard-page-header">
        <p className="eyebrow">{translate("dashboard.products")}</p>
        <h1>{translate("dashboard.createProduct")}</h1>
        <p>{translate("dashboard.productsSubtitle")}</p>
      </header>
      <ProductForm
        brands={references.brands}
        categories={references.categories}
        inventoryListPath={returnTo}
      />
    </DashboardLayout>
  );
}
