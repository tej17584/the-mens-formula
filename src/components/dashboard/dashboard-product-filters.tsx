"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/i18n";

type Option = { id: string; name: string };

export function DashboardProductFilters({
  brands,
  categories,
}: {
  brands: Option[];
  categories: Option[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

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

  return (
    <div className="dashboard-filters">
      <label className="search-field">
        <span className="sr-only">{t("common.search")}</span>
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={t("common.search")}
        />
      </label>
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
      <select
        value={params.get("visible") ?? ""}
        onChange={(event) => update({ visible: event.target.value })}
      >
        <option value="">{t("dashboard.allStatuses")}</option>
        <option value="true">{t("dashboard.visible")}</option>
        <option value="false">{t("dashboard.hidden")}</option>
      </select>
      <input
        aria-label={t("dashboard.priceMin")}
        type="number"
        min="0"
        step="0.01"
        defaultValue={params.get("minPrice") ?? ""}
        onBlur={(event) => update({ minPrice: event.target.value })}
        placeholder={t("dashboard.priceMin")}
      />
      <input
        aria-label={t("dashboard.priceMax")}
        type="number"
        min="0"
        step="0.01"
        defaultValue={params.get("maxPrice") ?? ""}
        onBlur={(event) => update({ maxPrice: event.target.value })}
        placeholder={t("dashboard.priceMax")}
      />
      <input
        aria-label={t("dashboard.distributorMin")}
        type="number"
        min="0"
        step="0.00000001"
        defaultValue={params.get("minDistributor") ?? ""}
        onBlur={(event) => update({ minDistributor: event.target.value })}
        placeholder={t("dashboard.distributorMin")}
      />
      <input
        aria-label={t("dashboard.distributorMax")}
        type="number"
        min="0"
        step="0.00000001"
        defaultValue={params.get("maxDistributor") ?? ""}
        onBlur={(event) => update({ maxDistributor: event.target.value })}
        placeholder={t("dashboard.distributorMax")}
      />
      <button
        type="button"
        className="clear-filters"
        onClick={() => {
          setQ("");
          router.replace(pathname, { scroll: false });
        }}
      >
        {t("catalog.clearFilters")}
      </button>
    </div>
  );
}
