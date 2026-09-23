import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProductActions } from "@/components/dashboard/dashboard-product-actions";
import { DashboardProductFilters } from "@/components/dashboard/dashboard-product-filters";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getDashboardProductPage,
  getDashboardReferences,
  type DashboardProductFilters as Filters,
} from "@/lib/dashboard";
import { formatPrice } from "@/lib/site-config";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function DashboardProductsPage({
  searchParams,
}: PageProps) {
  await requireAdmin();
  const raw = await searchParams;
  const filters: Filters = {
    page: Number(stringParam(raw.page)) || 1,
    q: stringParam(raw.q),
    brand: stringParam(raw.brand),
    category: stringParam(raw.category),
    visible: stringParam(raw.visible),
    minPrice: stringParam(raw.minPrice),
    maxPrice: stringParam(raw.maxPrice),
    minDistributor: stringParam(raw.minDistributor),
    maxDistributor: stringParam(raw.maxDistributor),
  };
  const [references, result] = await Promise.all([
    getDashboardReferences(),
    getDashboardProductPage(filters),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const page = Math.min(result.page, totalPages);
  const params = new URLSearchParams();
  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value === "string" && key !== "page") params.set(key, value);
  });
  const hrefForPage = (number: number) => {
    const next = new URLSearchParams(params);
    if (number > 1) next.set("page", String(number));
    return `/dashboard/products${next.size ? `?${next}` : ""}`;
  };
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-heading-row">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.products")}</h1>
        </div>
        <Link className="button button-primary" href="/dashboard/products/new">
          {translate("dashboard.newProduct")}
        </Link>
      </header>
      <DashboardProductFilters
        brands={references.brands}
        categories={references.categories}
      />
      <div className="dashboard-table-wrap">
        <table className="dashboard-table dashboard-inventory-table">
          <thead>
            <tr>
              <th>{translate("dashboard.image")}</th>
              <th>{translate("dashboard.productName")}</th>
              <th>{translate("catalog.brand")}</th>
              <th>{translate("catalog.category")}</th>
              <th>{translate("dashboard.publicPrice")}</th>
              <th>{translate("dashboard.distributorPrice")}</th>
              <th>{translate("dashboard.status")}</th>
              <th>{translate("dashboard.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {result.products.map((product) => (
              <tr key={product.id}>
                <td
                  className="inventory-cell inventory-image-cell"
                  data-label={translate("dashboard.image")}
                >
                  <div className="dashboard-table-image">
                    {product.main_image_url ? (
                      <Image
                        src={product.main_image_url}
                        alt=""
                        fill
                        sizes="52px"
                        quality={70}
                      />
                    ) : (
                      "TMF"
                    )}
                  </div>
                </td>
                <td
                  className="inventory-cell inventory-name-cell"
                  data-label={translate("dashboard.productName")}
                >
                  <Link href={`/dashboard/products/${product.id}`}>
                    <strong>{product.name}</strong>
                    <small>{product.sku ?? product.slug}</small>
                  </Link>
                </td>
                <td
                  className="inventory-cell"
                  data-label={translate("catalog.brand")}
                >
                  {product.brand?.name ?? "—"}
                </td>
                <td
                  className="inventory-cell"
                  data-label={translate("catalog.category")}
                >
                  {product.category?.name ?? "—"}
                </td>
                <td
                  className="inventory-cell inventory-price-cell"
                  data-label={translate("dashboard.publicPrice")}
                >
                  {formatPrice(product.consumer_price)}
                </td>
                <td
                  className="inventory-cell inventory-price-cell"
                  data-label={translate("dashboard.distributorPrice")}
                >
                  {formatPrice(
                    product.internal?.distributor_unit_price ?? null,
                  )}
                </td>
                <td
                  className="inventory-cell inventory-status-cell"
                  data-label={translate("dashboard.status")}
                >
                  <span
                    className={`status-pill ${product.is_active ? "active" : ""}`}
                  >
                    {product.is_active
                      ? translate("dashboard.visible")
                      : translate("dashboard.hidden")}
                  </span>
                </td>
                <td
                  className="inventory-cell inventory-actions-cell"
                  data-label={translate("dashboard.actions")}
                >
                  <ProductActions
                    editHref={`/dashboard/products/${product.id}`}
                    id={product.id}
                    isActive={product.is_active}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.products.length === 0 ? (
        <p className="empty-state">{translate("common.noResults")}</p>
      ) : null}
      <nav className="pagination" aria-label={translate("catalog.page")}>
        <Link
          aria-disabled={page <= 1}
          className={page <= 1 ? "disabled" : ""}
          href={hrefForPage(Math.max(1, page - 1))}
        >
          {translate("catalog.previous")}
        </Link>
        <span>
          {page} {translate("catalog.of")} {totalPages}
        </span>
        <Link
          aria-disabled={page >= totalPages}
          className={page >= totalPages ? "disabled" : ""}
          href={hrefForPage(Math.min(totalPages, page + 1))}
        >
          {translate("catalog.next")}
        </Link>
      </nav>
    </DashboardLayout>
  );
}
