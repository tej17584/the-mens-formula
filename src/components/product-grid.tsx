"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { CatalogProduct } from "@/lib/catalog";

const pageSize = 30;
const sortOptions = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "name-desc", label: "Nombre: Z-A" },
] as const;

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("categoria") ?? "all";
  const brand = searchParams.get("marca") ?? "all";
  const sort = searchParams.get("sort") ?? "relevance";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const categories = useMemo(
    () => [
      ...new Map(
        products.map((item) => [item.category.slug, item.category]),
      ).values(),
    ],
    [products],
  );
  const brands = useMemo(
    () => [
      ...new Map(
        products.map((item) => [item.brand.slug, item.brand]),
      ).values(),
    ],
    [products],
  );
  const updateParams = (
    updates: Record<string, string | null>,
    resetPage = true,
  ) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value && value !== "all" ? next.set(key, value) : next.delete(key),
    );
    if (resetPage) next.delete("page");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };
  const filtered = useMemo(
    () =>
      products
        .filter(
          (product) =>
            (category === "all" || product.category.slug === category) &&
            (brand === "all" || product.brand.slug === brand) &&
            product.name
              .toLocaleLowerCase("es-GT")
              .includes(q.toLocaleLowerCase("es-GT")),
        )
        .sort((first, second) => {
          if (sort === "price-asc")
            return (
              (first.consumer_price ?? Infinity) -
              (second.consumer_price ?? Infinity)
            );
          if (sort === "price-desc")
            return (
              (second.consumer_price ?? -Infinity) -
              (first.consumer_price ?? -Infinity)
            );
          if (sort === "name-asc")
            return first.name.localeCompare(second.name, "es");
          if (sort === "name-desc")
            return second.name.localeCompare(first.name, "es");
          return (
            Number(Boolean(second.main_image_url)) -
              Number(Boolean(first.main_image_url)) ||
            first.name.localeCompare(second.name, "es")
          );
        }),
    [products, category, brand, q, sort],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const filterControls = (
    <>
      <label className="select-field">
        <span>Categoría</span>
        <select
          value={category}
          onChange={(event) => updateParams({ categoria: event.target.value })}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="select-field">
        <span>Marca</span>
        <select
          value={brand}
          onChange={(event) => updateParams({ marca: event.target.value })}
        >
          <option value="all">Todas las marcas</option>
          {brands.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <button
        className="clear-filters"
        type="button"
        onClick={() =>
          updateParams({ q: null, categoria: null, marca: null, sort: null })
        }
      >
        Limpiar filtros
      </button>
    </>
  );
  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <p className="sidebar-title">Filtrar catálogo</p>
        {filterControls}
      </aside>
      <details className="mobile-filters">
        <summary>
          Filtros{" "}
          <span>{category !== "all" || brand !== "all" ? "activos" : ""}</span>
        </summary>
        <div>{filterControls}</div>
      </details>
      <section className="catalog-results">
        <div className="catalog-toolbar">
          <label className="search-field">
            <span className="sr-only">Buscar productos</span>
            <input
              value={q}
              onChange={(event) => updateParams({ q: event.target.value })}
              placeholder="Buscar productos..."
              type="search"
            />
          </label>
          <label className="sort-field">
            <span className="sr-only">Ordenar productos</span>
            <select
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="catalog-count">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"} ·
          Página {safePage} de {totalPages}
        </p>
        {paged.length ? (
          <div className="product-grid">
            {paged.map((product, index) => (
              <ProductCard
                product={product}
                priority={index < 4}
                key={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No encontramos productos con esos filtros.</p>
            <button
              type="button"
              onClick={() =>
                updateParams({
                  q: null,
                  categoria: null,
                  marca: null,
                  sort: null,
                })
              }
            >
              Limpiar filtros
            </button>
          </div>
        )}
        <nav className="pagination" aria-label="Paginación del catálogo">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => updateParams({ page: String(safePage - 1) }, false)}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                className={number === safePage ? "active" : ""}
                type="button"
                aria-current={number === safePage ? "page" : undefined}
                onClick={() => updateParams({ page: String(number) }, false)}
              >
                {number}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => updateParams({ page: String(safePage + 1) }, false)}
          >
            Siguiente
          </button>
        </nav>
      </section>
    </div>
  );
}
