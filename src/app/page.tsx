import Link from "next/link";
import { HeroShowcaseStage } from "@/components/hero-showcase-collage";
import { HomeBrandsSection } from "@/components/home-brands-section";
import { HomeProductCarousel } from "@/components/home-product-carousel";
import { HomeStatCard } from "@/components/home-stat-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/social-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { translate } from "@/i18n";
import { getCatalogProducts, getDiverseProducts, getSiteSettings } from "@/lib/catalog";
import { whatsappHref } from "@/lib/site-links";

const HERO_PRODUCT_COUNT = 8;

function pickHeroProducts(
  products: Awaited<ReturnType<typeof getCatalogProducts>>,
) {
  const withImages = products.filter((product) => product.main_image_url);
  const diverse = getDiverseProducts(withImages, HERO_PRODUCT_COUNT);
  if (diverse.length >= HERO_PRODUCT_COUNT) return diverse;
  const seen = new Set(diverse.map((product) => product.id));
  for (const product of withImages) {
    if (seen.has(product.id)) continue;
    diverse.push(product);
    seen.add(product.id);
    if (diverse.length >= HERO_PRODUCT_COUNT) break;
  }
  return diverse;
}

export default async function Home() {
  const [products, settings] = await Promise.all([
    getCatalogProducts(),
    getSiteSettings(),
  ]);
  const selection = getDiverseProducts(products, 8);
  const heroProducts = pickHeroProducts(products);
  const brands = new Set(products.map((product) => product.brand.id)).size;
  const waHref = settings.whatsappNumber
    ? whatsappHref(settings.whatsappNumber)
    : null;
  const contactHref = waHref ?? "/contacto";
  const contactIsExternal = contactHref.startsWith("http");

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
                  className="hero-cta storefront-primary-cta"
                  nativeButton={false}
                  render={<Link href="/catalogo" />}
                  size="storefront"
                >
                  {translate("home.explore")}
                  <span aria-hidden="true" data-icon="inline-end">
                    →
                  </span>
                </Button>
                <Button
                  className="hero-cta-secondary storefront-ghost-cta"
                  nativeButton={false}
                  render={<Link href="/contacto" />}
                  size="storefront"
                  variant="outline"
                >
                  {translate("home.contactCta")}
                </Button>
              </div>
            </div>
            <div className="hero-showcase" aria-hidden="true">
              <div className="hero-showcase-beam" />
              <div className="hero-showcase-beam hero-showcase-beam--alt" />
              <HeroShowcaseStage products={heroProducts} />
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
              value={
                <>
                  {translate("home.volumePricesShort")}
                  <span className="home-stat-card-tiers">
                    <span>3+</span>
                    <span>6+</span>
                    <span>{translate("home.volumeTierBox")}</span>
                  </span>
                </>
              }
              variant="volume"
            />
            <HomeStatCard
              kicker={translate("home.statShippingKicker")}
              label={translate("home.shippingLabel")}
              value={translate("home.shippingHeadline")}
              variant="shipping"
            />
          </div>
        </section>
        <HomeBrandsSection
          products={products}
          eyebrow={translate("home.brandsEyebrow")}
        />
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
              className="section-heading-action storefront-primary-cta"
              nativeButton={false}
              render={<Link href="/catalogo" />}
              size="storefront"
            >
              {translate("home.viewCatalog")}
              <span aria-hidden="true" data-icon="inline-end">
                →
              </span>
            </Button>
          </div>
          <Separator className="home-products-rule" />
          <HomeProductCarousel products={selection} />
        </section>
        <section className="home-cta-band">
          <div className="shell storefront-shell home-cta-band-shell">
            <div className="home-cta-band-inner">
              <span className="home-cta-whatsapp-mark" aria-hidden="true">
                <WhatsAppIcon />
              </span>
              <span className="home-cta-divider" aria-hidden="true" />
              <div className="home-cta-copy">
                <Badge className="page-eyebrow-badge" variant="secondary">
                  {translate("home.ctaEyebrow")}
                </Badge>
                <h2>{translate("home.ctaTitle")}</h2>
                <p>{translate("home.ctaDescription")}</p>
              </div>
              <div className="home-cta-actions">
                <Button
                  className="home-cta-band-button storefront-primary-cta"
                  nativeButton={false}
                  render={
                    <Link
                      href={contactHref}
                      rel={contactIsExternal ? "noopener noreferrer" : undefined}
                      target={contactIsExternal ? "_blank" : undefined}
                    />
                  }
                  size="storefront"
                >
                  <WhatsAppIcon data-icon="inline-start" />
                  {translate("home.contactCta")}
                  <span aria-hidden="true" data-icon="inline-end">
                    →
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}