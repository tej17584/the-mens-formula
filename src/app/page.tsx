import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { translate } from "@/i18n";
import { getCatalogProducts, getDiverseProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getCatalogProducts();
  const selection = getDiverseProducts(products);
  const heroProducts = selection
    .filter((product) => product.main_image_url)
    .slice(0, 4);
  const brands = new Set(products.map((product) => product.brand.id)).size;
  return (
    <div className="site-page">
      <SiteHeader />
      <main>
        <section className="hero hero-catalog">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{translate("home.eyebrow")}</p>
              <h1>{translate("home.title")}</h1>
              <p>{translate("home.description")}</p>
              <Link className="button button-primary" href="/catalogo">
                {translate("home.explore")} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-product-composition" aria-hidden="true">
              {heroProducts.map((product, index) => (
                <div
                  className={`hero-product hero-product-${index + 1}`}
                  key={product.id}
                >
                  <Image
                    src={product.main_image_url!}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, 1px"
                    quality={82}
                    priority={index === 0}
                  />
                </div>
              ))}
              <Image
                className="hero-watermark"
                src="/mark.png"
                alt=""
                width={360}
                height={360}
              />
            </div>
          </div>
        </section>
        <section className="catalog-facts">
          <div className="shell">
            <span>
              {products.length} {translate("home.products")}
            </span>
            <span>
              {brands} {translate("home.brands")}
            </span>
            <span>{translate("home.volumePrices")}</span>
          </div>
        </section>
        <section
          className="shell home-products"
          aria-labelledby="products-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">{translate("home.catalogEyebrow")}</p>
              <h2 id="products-title">{translate("home.catalogTitle")}</h2>
              <p>{translate("home.catalogDescription")}</p>
            </div>
            <Link className="text-link" href="/catalogo">
              {translate("home.viewCatalog")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="product-grid home-grid">
            {selection.map((product, index) => (
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
