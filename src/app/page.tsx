import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getCatalogProducts();
  return (
    <div className="site-page">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">The Men&apos;s Formula</p>
              <h1>Lo esencial para trabajar con oficio.</h1>
              <p>
                Productos profesionales, herramientas y acabados para la rutina
                de barbería.
              </p>
              <Link className="button button-primary" href="/catalogo">
                Explorar catálogo <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-mark" aria-hidden="true">
              <Image src="/mark.png" alt="" width={300} height={300} priority />
            </div>
          </div>
        </section>
        <section className="catalog-cta">
          <div className="shell catalog-cta-grid">
            <p className="eyebrow">Catálogo</p>
            <div>
              <h2>Encuentra lo que tu estación necesita.</h2>
              <p>
                Explora por marca, categoría o producto y consulta los detalles
                antes de comprar.
              </p>
            </div>
            <Link className="text-link text-link-large" href="/catalogo">
              Ver todos los productos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <section
          className="shell home-products"
          aria-labelledby="products-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selección del catálogo</p>
              <h2 id="products-title">Directo a los productos.</h2>
            </div>
            <Link className="text-link" href="/catalogo">
              Ver catálogo <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="product-grid home-grid">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                product={product}
                priority={index < 2}
                key={product.id}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
