"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
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
  const filtered = products.filter(
    (product) =>
      (category === "all" || product.category.slug === category) &&
      (brand === "all" || product.brand.slug === brand) &&
      product.name
        .toLocaleLowerCase("es-GT")
        .includes(search.toLocaleLowerCase("es-GT")),
  );

  return (
    <div>
      <div className="catalog-controls">
        <label className="search-field">
          <span className="sr-only">Buscar productos</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar productos..."
            type="search"
          />
        </label>
        <label className="select-field">
          <span>Categoría</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Todas</option>
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
            onChange={(event) => setBrand(event.target.value)}
          >
            <option value="all">Todas</option>
            {brands.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="catalog-count">
        {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
      </p>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product, index) => (
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
            onClick={() => {
              setSearch("");
              setCategory("all");
              setBrand("all");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
