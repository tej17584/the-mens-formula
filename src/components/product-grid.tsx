import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { CatalogControls } from "@/components/catalog-controls";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
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
      if (!value || key === "page") return;
      if (key === "sort" && value === "relevance") return;
      params.set(key, value);
    });
    if (number > 1) params.set("page", String(number));
    return `/catalogo${params.size ? `?${params}` : ""}`;
  };
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  const pageStatus = `${translate("catalog.page")} ${page} ${translate("catalog.of")} ${totalPages}`;
  return (
    <CatalogControls categories={categories} brands={brands}>
      <div className="catalog-meta-row">
        <Badge variant="secondary">
          {total}{" "}
          {total === 1
            ? translate("catalog.product")
            : translate("catalog.products")}
        </Badge>
        <p className="catalog-count">
          {translate("catalog.page")} {page} {translate("catalog.of")}{" "}
          {totalPages}
        </p>
      </div>
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
        <Empty className="catalog-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>{translate("common.noResults")}</EmptyTitle>
            <EmptyDescription>
              {translate("catalog.noResultsHint")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/catalogo" />}>
              {translate("catalog.clearFilters")}
            </Button>
          </EmptyContent>
        </Empty>
      )}
      {totalPages > 1 ? (
        <Pagination
          className="catalog-pagination"
          aria-label={translate("catalog.page")}
        >
          <PaginationContent className="catalog-pagination-content">
            <PaginationItem>
              {hasPrevious ? (
                <Link
                  className="catalog-pagination-nav"
                  href={hrefForPage(page - 1)}
                  prefetch={false}
                  rel="prev"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  <span>{translate("catalog.previous")}</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="catalog-pagination-nav is-disabled"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  <span>{translate("catalog.previous")}</span>
                </span>
              )}
            </PaginationItem>
            <PaginationItem className="catalog-pagination-status">
              <span aria-current="page" className="catalog-pagination-current">
                {page}
              </span>
              <span aria-hidden="true" className="catalog-pagination-separator">
                /
              </span>
              <span className="catalog-pagination-total">{totalPages}</span>
              <span className="sr-only">{pageStatus}</span>
            </PaginationItem>
            <PaginationItem>
              {hasNext ? (
                <Link
                  className="catalog-pagination-nav"
                  href={hrefForPage(page + 1)}
                  prefetch={false}
                  rel="next"
                >
                  <span>{translate("catalog.next")}</span>
                  <ChevronRightIcon aria-hidden="true" />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="catalog-pagination-nav is-disabled"
                >
                  <span>{translate("catalog.next")}</span>
                  <ChevronRightIcon aria-hidden="true" />
                </span>
              )}
            </PaginationItem>
          </PaginationContent>
          <p aria-hidden="true" className="catalog-pagination-caption">
            {pageStatus}
          </p>
        </Pagination>
      ) : (
        <p className="catalog-pagination-caption catalog-pagination-caption-only">
          {pageStatus}
        </p>
      )}
    </CatalogControls>
  );
}
