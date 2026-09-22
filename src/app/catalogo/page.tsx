import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";
export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Catálogo de productos profesionales para barbería de The Men's Formula.",
};
export default async function CatalogPage() {
  const products = await getCatalogProducts();
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="catalog-page shell">
        <div className="catalog-intro">
          <p className="eyebrow">The Men&apos;s Formula</p>
          <h1>Catálogo profesional</h1>
          <p>Productos organizados para que encuentres rápido lo que buscas.</p>
        </div>
        <Suspense
          fallback={<div className="catalog-loading">Cargando catálogo…</div>}
        >
          <ProductGrid products={products} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
