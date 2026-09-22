import Link from "next/link";
import { CatalogControls } from "@/components/catalog-controls";
import { ProductCard } from "@/components/product-card";
import { translate } from "@/i18n";
import type { CatalogProduct } from "@/lib/catalog";

type Option = { slug: string; name: string };

export function ProductGrid({
  products,
  categories,
  brands,
  total,
  page,
  totalPages,
  query,
}: {
  products: CatalogProduct[];
  categories: Option[];
  brands: Option[];
  total: number;
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
}) {
  const hrefForPage = (number: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (number > 1) params.set("page", String(number));
    return `/catalogo${params.size ? `?${params}` : ""}`;
  };
  return (
    <CatalogControls categories={categories} brands={brands}>
      <p className="catalog-count">
        {total}{" "}
        {total === 1
          ? translate("catalog.product")
          : translate("catalog.products")}{" "}
        · {translate("catalog.page")} {page} {translate("catalog.of")}{" "}
        {totalPages}
      </p>
      {products.length ? (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              product={product}
              priority={index < 2}
              key={product.id}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{translate("common.noResults")}</p>
          <Link href="/catalogo">{translate("catalog.clearFilters")}</Link>
        </div>
      )}
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
    </CatalogControls>
  );
}
