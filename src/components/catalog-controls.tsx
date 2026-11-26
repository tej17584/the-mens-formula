"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BrandLoader } from "@/components/ui/brand-loader";
import { RouteLoadingRegion } from "@/components/ui/route-loading-overlay";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslations } from "@/i18n";

type Option = { slug: string; name: string };

function CatalogSearchField({
  initialQuery,
  onSearch,
  searchLabel,
  placeholder,
  submitLabel,
}: {
  initialQuery: string;
  onSearch: (query: string) => void;
  searchLabel: string;
  placeholder: string;
  submitLabel: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(q.trim());
  };

  return (
    <form className="search-field" onSubmit={search}>
      <InputGroup className="catalog-search-group shadow-none has-[[data-slot=input-group-control]:focus-visible]:!border-[var(--color-brand)] has-[[data-slot=input-group-control]:focus-visible]:!shadow-none has-[[data-slot=input-group-control]:focus-visible]:!ring-0">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          aria-label={searchLabel}
          onChange={(event) => setQ(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={q}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="catalog-search-submit"
            type="submit"
            variant="secondary"
            size="sm"
          >
            {submitLabel}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

export function CatalogControls({
  categories,
  brands,
  children,
}: {
  categories: Option[];
  brands: Option[];
  children: ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const committedQuery = params.get("q") ?? "";
  const update = (updates: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      const isDefault =
        !value || value === "all" || (key === "sort" && value === "relevance");
      if (isDefault) next.delete(key);
      else next.set(key, value);
    });
    if (resetPage) next.delete("page");
    const nextUrl = next.size ? `${pathname}?${next.toString()}` : pathname;
    const currentUrl = params.size
      ? `${pathname}?${params.toString()}`
      : pathname;
    if (nextUrl === currentUrl) return;
    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  const categoria = params.get("categoria") ?? "all";
  const marca = params.get("marca") ?? "all";
  const renderFilterFields = () => (
    <>
      <label className="select-field catalog-filter-field">
        <span>{t("catalog.category")}</span>
        <select
          value={categoria}
          onChange={(event) => update({ categoria: event.target.value })}
        >
          <option value="all">{t("catalog.allCategories")}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="select-field catalog-filter-field">
        <span>{t("catalog.brand")}</span>
        <select
          value={marca}
          onChange={(event) => update({ marca: event.target.value })}
        >
          <option value="all">{t("catalog.allBrands")}</option>
          {brands.map((brand) => (
            <option key={brand.slug} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <Button
        className="clear-filters"
        type="button"
        variant="ghost"
        onClick={() =>
          update({ q: null, categoria: null, marca: null, sort: null })
        }
      >
        {t("catalog.clearFilters")}
      </Button>
    </>
  );
  const hasFilters = Boolean(
    params.get("categoria") || params.get("marca") || params.get("q"),
  );
  const filterPanel = (
    <Card className="catalog-filter-panel" size="sm">
      <CardHeader>
        <CardTitle className="sidebar-title">{t("catalog.filters")}</CardTitle>
        {hasFilters ? (
          <Badge variant="secondary">{t("catalog.filtersActive")}</Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {renderFilterFields()}
      </CardContent>
    </Card>
  );
  return (
    <div className="catalog-layout catalog-storefront">
      <aside className="catalog-sidebar">{filterPanel}</aside>
      <section
        className="mobile-filters"
        aria-label={t("catalog.filters")}
      >
        <div className="mobile-filters-heading">
          <span>{t("catalog.filters")}</span>
          {hasFilters ? (
            <span className="mobile-filters-active">{t("catalog.filtersActive")}</span>
          ) : null}
        </div>
        <div className="mobile-filters-body">{renderFilterFields()}</div>
      </section>
      <RouteLoadingRegion
        pending={isPending}
        label={t("common.loading")}
        className="catalog-results"
      >
        <div className="catalog-toolbar catalog-toolbar-panel">
          {isPending ? (
            <div className="catalog-toolbar-loading">
              <BrandLoader size="sm" label={t("common.loading")} />
            </div>
          ) : null}
          <CatalogSearchField
            key={committedQuery}
            initialQuery={committedQuery}
            onSearch={(query) => update({ q: query || null })}
            placeholder={t("catalog.searchPlaceholder")}
            searchLabel={t("common.search")}
            submitLabel={t("common.search")}
          />
          <label className="sort-field">
            <span className="sr-only">{t("catalog.sort")}</span>
            <select
              value={params.get("sort") ?? "relevance"}
              onChange={(event) => update({ sort: event.target.value })}
            >
              <option value="relevance">{t("catalog.relevance")}</option>
              <option value="price-asc">{t("catalog.priceAsc")}</option>
              <option value="price-desc">{t("catalog.priceDesc")}</option>
              <option value="name-asc">{t("catalog.nameAsc")}</option>
              <option value="name-desc">{t("catalog.nameDesc")}</option>
            </select>
          </label>
        </div>
        {children}
      </RouteLoadingRegion>
    </div>
  );
}
