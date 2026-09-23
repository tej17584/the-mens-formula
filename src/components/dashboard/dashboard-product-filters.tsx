"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/i18n";

type Option = { id: string; name: string };

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

  const activeFilters = useMemo(() => {
    const brand = brands.find((item) => item.id === params.get("brand"));
    const category = categories.find(
      (item) => item.id === params.get("category"),
    );
    return [
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
        <button
          aria-expanded={open}
          className="dashboard-filter-trigger"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          {t("dashboard.filters")}
          {activeFilters.length ? <span>{activeFilters.length}</span> : null}
        </button>
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
              onClick={() => {
                if (filter.key === "price")
                  update({ minPrice: "", maxPrice: "" });
                else if (filter.key === "distributor")
                  update({ minDistributor: "", maxDistributor: "" });
                else update({ [filter.key]: "" });
              }}
            >
              {filter.label} <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            className="dashboard-clear-filters"
            type="button"
            onClick={clear}
          >
            {t("catalog.clearFilters")}
          </button>
        </div>
      ) : null}

      {open ? (
        <>
          <button
            aria-label={t("dashboard.closeFilters")}
            className="dashboard-filter-backdrop"
            type="button"
            onClick={() => setOpen(false)}
          />
          <div className="dashboard-filter-panel">
            <div className="dashboard-filter-panel-heading">
              <strong>{t("dashboard.filters")}</strong>
              <button type="button" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </button>
            </div>
            <div className="dashboard-filter-controls">
              <label>
                <span>{t("catalog.brand")}</span>
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
                <span>{t("catalog.category")}</span>
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
                <span>{t("dashboard.status")}</span>
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
                <input
                  aria-label={t("dashboard.priceMin")}
                  defaultValue={params.get("minPrice") ?? ""}
                  min="0"
                  placeholder={t("dashboard.from")}
                  step="0.01"
                  type="number"
                  onBlur={(event) => update({ minPrice: event.target.value })}
                />
                <input
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
                <input
                  aria-label={t("dashboard.distributorMin")}
                  defaultValue={params.get("minDistributor") ?? ""}
                  min="0"
                  placeholder={t("dashboard.from")}
                  step="0.00000001"
                  type="number"
                  onBlur={(event) =>
                    update({ minDistributor: event.target.value })
                  }
                />
                <input
                  aria-label={t("dashboard.distributorMax")}
                  defaultValue={params.get("maxDistributor") ?? ""}
                  min="0"
                  placeholder={t("dashboard.to")}
                  step="0.00000001"
                  type="number"
                  onBlur={(event) =>
                    update({ maxDistributor: event.target.value })
                  }
                />
              </fieldset>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
