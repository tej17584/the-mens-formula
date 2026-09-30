import Link from "next/link";
import { SearchIcon } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
      <Pagination className="catalog-pagination" aria-label={translate("catalog.page")}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page <= 1}
              aria-label={translate("catalog.previous")}
              className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              href={hrefForPage(Math.max(1, page - 1))}
              text={translate("catalog.previous")}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={hrefForPage(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= totalPages}
              aria-label={translate("catalog.next")}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : undefined
              }
              href={hrefForPage(Math.min(totalPages, page + 1))}
              text={translate("catalog.next")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CatalogControls>
  );
}
