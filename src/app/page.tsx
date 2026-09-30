import Image from "next/image";
import Link from "next/link";
import { HomeStatCard } from "@/components/home-stat-card";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
          <div className="shell storefront-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{translate("home.eyebrow")}</p>
              <h1>{translate("home.title")}</h1>
              <p>{translate("home.description")}</p>
              <div className="hero-actions">
                <Button
                  className="hero-cta"
                  nativeButton={false}
                  render={<Link href="/catalogo" />}
                  size="lg"
                >
                  {translate("home.explore")}
                  <span aria-hidden="true" data-icon="inline-end">
                    →
                  </span>
                </Button>
                <Button
                  className="hero-cta-secondary"
                  nativeButton={false}
                  render={<Link href="/contacto" />}
                  size="lg"
                  variant="outline"
                >
                  {translate("home.contactCta")}
                </Button>
              </div>
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
        <section className="home-stats" aria-label={translate("home.statsLabel")}>
          <div className="shell storefront-shell home-stats-grid">
            <HomeStatCard
              kicker={translate("home.statProductsKicker")}
              label={translate("home.productsLabel")}
              value={products.length}
              variant="products"
            />
            <HomeStatCard
              kicker={translate("home.statBrandsKicker")}
              label={translate("home.brandsLabel")}
              value={brands}
              variant="brands"
            />
            <HomeStatCard
              kicker={translate("home.statVolumeKicker")}
              label={translate("home.volumePricesDetail")}
              value={translate("home.volumePricesShort")}
              variant="volume"
              wide
            />
          </div>
        </section>
        <section className="home-cta-band">
          <div className="shell storefront-shell home-cta-band-inner">
            <div className="home-cta-copy">
              <Badge className="page-eyebrow-badge" variant="secondary">
                {translate("home.ctaEyebrow")}
              </Badge>
              <h2>{translate("home.ctaTitle")}</h2>
              <p>{translate("home.ctaDescription")}</p>
            </div>
            <div className="home-cta-actions">
              <Button
                className="home-cta-band-button"
                nativeButton={false}
                render={<Link href="/contacto" />}
                size="lg"
              >
                {translate("home.contactCta")}
                <span aria-hidden="true" data-icon="inline-end">
                  →
                </span>
              </Button>
            </div>
          </div>
        </section>
        <section
          className="shell storefront-shell home-products"
          aria-labelledby="products-title"
        >
          <div className="section-heading storefront-section-heading">
            <div>
              <Badge className="page-eyebrow-badge" variant="outline">
                {translate("home.catalogEyebrow")}
              </Badge>
              <h2 id="products-title">{translate("home.catalogTitle")}</h2>
              <p>{translate("home.catalogDescription")}</p>
            </div>
            <Button
              className="section-heading-action"
              nativeButton={false}
              render={<Link href="/catalogo" />}
              size="lg"
              variant="outline"
            >
              {translate("home.viewCatalog")}
              <span aria-hidden="true" data-icon="inline-end">
                →
              </span>
            </Button>
          </div>
          <Separator className="home-products-rule" />
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
