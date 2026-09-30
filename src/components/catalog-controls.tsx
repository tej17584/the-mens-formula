"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslations } from "@/i18n";

type Option = { slug: string; name: string };

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
  const [q, setQ] = useState(params.get("q") ?? "");
  const update = (updates: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") next.set(key, value);
      else next.delete(key);
    });
    if (resetPage) next.delete("page");
    router.replace(next.size ? `${pathname}?${next}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({ q: q.trim() || null });
  };

  const filters = (
    <>
      <label className="select-field">
        <span>{t("catalog.category")}</span>
        <select
          value={params.get("categoria") ?? "all"}
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
      <label className="select-field">
        <span>{t("catalog.brand")}</span>
        <select
          value={params.get("marca") ?? "all"}
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
  const hasFilters = Boolean(params.get("categoria") || params.get("marca"));
  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <p className="sidebar-title">{t("catalog.filters")}</p>
        {filters}
      </aside>
      <details className="mobile-filters">
        <summary>
          {t("catalog.filters")}{" "}
          <span>{hasFilters ? t("catalog.filtersActive") : ""}</span>
        </summary>
        <div>{filters}</div>
      </details>
      <section className="catalog-results">
        <div className="catalog-toolbar">
          <form className="search-field" onSubmit={search}>
            <InputGroup className="catalog-search-group">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                aria-label={t("common.search")}
                onChange={(event) => setQ(event.target.value)}
                placeholder={t("catalog.searchPlaceholder")}
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
                  {t("common.search")}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
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
      </section>
    </div>
  );
}
