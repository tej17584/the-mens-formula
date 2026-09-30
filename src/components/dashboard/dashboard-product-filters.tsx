"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "@/i18n";

type Option = { id: string; name: string };

function FilterFields({
  brands,
  categories,
  params,
  update,
}: {
  brands: Option[];
  categories: Option[];
  params: URLSearchParams;
  update: (changes: Record<string, string>) => void;
}) {
  const t = useTranslations();
  return (
    <div className="dashboard-filter-fields">
      <label>
        <Label>{t("catalog.brand")}</Label>
        <select
          value={params.get("brand") ?? ""}
          onChange={(event) => update({ brand: event.target.value })}
        >
          <option value="">{t("catalog.allBrands")}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <Label>{t("catalog.category")}</Label>
        <select
          value={params.get("category") ?? ""}
          onChange={(event) => update({ category: event.target.value })}
        >
          <option value="">{t("catalog.allCategories")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <Label>{t("dashboard.status")}</Label>
        <select
          value={params.get("visible") ?? ""}
          onChange={(event) => update({ visible: event.target.value })}
        >
          <option value="">{t("dashboard.allStatuses")}</option>
          <option value="true">{t("dashboard.visible")}</option>
          <option value="false">{t("dashboard.hidden")}</option>
        </select>
      </label>
      <fieldset>
        <legend>{t("dashboard.publicPrice")}</legend>
        <Input
          aria-label={t("dashboard.priceMin")}
          defaultValue={params.get("minPrice") ?? ""}
          min="0"
          placeholder={t("dashboard.from")}
          step="0.01"
          type="number"
          onBlur={(event) => update({ minPrice: event.target.value })}
        />
        <Input
          aria-label={t("dashboard.priceMax")}
          defaultValue={params.get("maxPrice") ?? ""}
          min="0"
          placeholder={t("dashboard.to")}
          step="0.01"
          type="number"
          onBlur={(event) => update({ maxPrice: event.target.value })}
        />
      </fieldset>
      <fieldset>
        <legend>{t("dashboard.distributorPrice")}</legend>
        <Input
          aria-label={t("dashboard.distributorMin")}
          defaultValue={params.get("minDistributor") ?? ""}
          min="0"
          placeholder={t("dashboard.from")}
          step="0.00000001"
          type="number"
          onBlur={(event) => update({ minDistributor: event.target.value })}
        />
        <Input
          aria-label={t("dashboard.distributorMax")}
          defaultValue={params.get("maxDistributor") ?? ""}
          min="0"
          placeholder={t("dashboard.to")}
          step="0.00000001"
          type="number"
          onBlur={(event) => update({ maxDistributor: event.target.value })}
        />
      </fieldset>
    </div>
  );
}

export function DashboardProductFilters({
  brands,
  categories,
  resultCount,
}: {
  brands: Option[];
  categories: Option[];
  resultCount: number;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);

  const update = useCallback(
    (changes: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      next.delete("page");
      next.delete("status");
      router.replace(next.size ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    },
    [params, pathname, router],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (q !== (params.get("q") ?? "")) update({ q });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [q, params, update]);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const activeFilters = useMemo(() => {
    const brand = brands.find((item) => item.id === params.get("brand"));
    const category = categories.find(
      (item) => item.id === params.get("category"),
    );
    const query = params.get("q");
    return [
      query
        ? { key: "q", label: `${t("dashboard.fromSearch")}: ${query}` }
        : null,
      brand
        ? { key: "brand", label: `${t("catalog.brand")}: ${brand.name}` }
        : null,
      category
        ? {
            key: "category",
            label: `${t("catalog.category")}: ${category.name}`,
          }
        : null,
      params.get("visible") === "true"
        ? { key: "visible", label: t("dashboard.visible") }
        : null,
      params.get("visible") === "false"
        ? { key: "visible", label: t("dashboard.hidden") }
        : null,
      params.get("minPrice") || params.get("maxPrice")
        ? { key: "price", label: t("dashboard.publicPrice") }
        : null,
      params.get("minDistributor") || params.get("maxDistributor")
        ? { key: "distributor", label: t("dashboard.distributorPrice") }
        : null,
    ].filter((item): item is { key: string; label: string } => Boolean(item));
  }, [brands, categories, params, t]);

  const clear = () => {
    setQ("");
    setOpen(false);
    router.replace(pathname, { scroll: false });
  };

  const removeChip = (key: string) => {
    if (key === "q") setQ("");
    if (key === "price") update({ minPrice: "", maxPrice: "" });
    else if (key === "distributor")
      update({ minDistributor: "", maxDistributor: "" });
    else update({ [key]: "" });
  };

  const filterFields = (
    <FilterFields
      brands={brands}
      categories={categories}
      params={params}
      update={update}
    />
  );

  return (
    <section
      className="dashboard-inventory-toolbar"
      aria-label={t("dashboard.filters")}
    >
      <div className="dashboard-toolbar-main">
        <label className="dashboard-search-field">
          <span className="sr-only">{t("common.search")}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("dashboard.searchProducts")}
          />
        </label>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" className="dashboard-filter-trigger" />
            }
          >
            <SlidersHorizontal className="size-4" />
            {t("dashboard.filters")}
            {activeFilters.length ? <span>{activeFilters.length}</span> : null}
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="dashboard-filter-sheet max-h-[85dvh] overflow-y-auto sm:max-w-none md:max-w-3xl md:rounded-t-xl"
          >
            <SheetHeader>
              <SheetTitle>{t("dashboard.filters")}</SheetTitle>
              <SheetDescription>
                {t("dashboard.productsSubtitle")}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-2">{filterFields}</div>
            <SheetFooter>
              {activeFilters.length ? (
                <Button variant="ghost" type="button" onClick={clear}>
                  {t("catalog.clearFilters")}
                </Button>
              ) : null}
              <Button type="button" onClick={() => setOpen(false)}>
                {t("dashboard.applyFilters")}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          type="button"
          className="dashboard-toolbar-clear"
          disabled={!activeFilters.length && !q}
          onClick={clear}
        >
          {t("catalog.clearFilters")}
        </Button>
        <span className="dashboard-result-count">
          {resultCount} {t("catalog.products")}
        </span>
      </div>

      {activeFilters.length ? (
        <div
          className="dashboard-filter-chips"
          aria-label={t("dashboard.filtersActive")}
        >
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => removeChip(filter.key)}
            >
              {filter.label} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="dashboard-filter-desktop">{filterFields}</div>
    </section>
  );
}
