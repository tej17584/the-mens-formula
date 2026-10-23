import { notFound } from "next/navigation";
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductForm } from "@/components/dashboard/product-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardProduct, getDashboardReferences } from "@/lib/dashboard";
import { sanitizeDashboardReturnTo } from "@/lib/dashboard/products-list-query";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const returnTo = sanitizeDashboardReturnTo(query.returnTo);
  const [product, references] = await Promise.all([
    getDashboardProduct(id),
    getDashboardReferences(),
  ]);
  if (!product) notFound();
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
        <h1>{translate("dashboard.updateProduct")}</h1>
        <p>{translate("dashboard.productsSubtitle")}</p>
      </header>
      <ProductForm
        brands={references.brands}
        categories={references.categories}
        inventoryListPath={returnTo}
        product={product}
      />
    </DashboardLayout>
  );
}
