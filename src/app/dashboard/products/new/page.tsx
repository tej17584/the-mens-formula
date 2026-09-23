import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductForm } from "@/components/dashboard/product-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardReferences } from "@/lib/dashboard";

export default async function NewProductPage() {
  await requireAdmin();
  const references = await getDashboardReferences();
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-page-header">
        <p className="eyebrow">{translate("dashboard.products")}</p>
        <h1>{translate("dashboard.createProduct")}</h1>
        <p>{translate("dashboard.productsSubtitle")}</p>
      </header>
      <ProductForm
        brands={references.brands}
        categories={references.categories}
      />
    </DashboardLayout>
  );
}
