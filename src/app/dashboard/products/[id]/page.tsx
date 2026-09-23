import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductForm } from "@/components/dashboard/product-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardProduct, getDashboardReferences } from "@/lib/dashboard";

export default async function EditProductPage({
  params,
}: PageProps<"/dashboard/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
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
        product={product}
      />
    </DashboardLayout>
  );
}
