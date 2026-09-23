import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { translate } from "@/i18n";
import { getCatalogFilters, getCatalogPage } from "@/lib/catalog";

export const metadata: Metadata = {
  title: translate("catalog.metaTitle"),
  description: translate("catalog.metaDescription"),
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function CatalogPage({ searchParams }: Props) {
  const raw = await searchParams;
  const query = {
    q: param(raw.q),
    category: param(raw.categoria),
    brand: param(raw.marca),
    sort: param(raw.sort),
    page: Number(param(raw.page)) || 1,
  };
  const [result, filters] = await Promise.all([
    getCatalogPage(query),
    getCatalogFilters(),
  ]);
  if (result.page !== query.page) {
    const normalized = new URLSearchParams();
    if (query.q) normalized.set("q", query.q);
    if (query.category) normalized.set("categoria", query.category);
    if (query.brand) normalized.set("marca", query.brand);
    if (query.sort) normalized.set("sort", query.sort);
    if (result.page > 1) normalized.set("page", String(result.page));
    redirect(`/catalogo${normalized.size ? `?${normalized}` : ""}`);
  }
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const page = Math.min(result.page, totalPages);
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="catalog-page shell">
        <div className="catalog-intro">
          <p className="eyebrow">The Men&apos;s Formula</p>
          <h1>{translate("catalog.title")}</h1>
          <p>{translate("catalog.description")}</p>
        </div>
        <ProductGrid
          products={result.products}
          categories={filters.categories}
          brands={filters.brands}
          total={result.total}
          page={page}
          totalPages={totalPages}
          query={{
            q: query.q,
            categoria: query.category,
            marca: query.brand,
            sort: query.sort,
          }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
