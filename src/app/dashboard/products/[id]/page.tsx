import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductForm } from "@/components/dashboard/product-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardProduct, getDashboardReferences } from "@/lib/dashboard";

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
  const returnTo =
    typeof query.returnTo === "string" && query.returnTo.startsWith("/dashboard")
      ? query.returnTo
      : "/dashboard/products";
  const [product, references] = await Promise.all([
    getDashboardProduct(id),
    getDashboardReferences(),
  ]);
  if (!product) notFound();
  return (
    <DashboardLayout>
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
