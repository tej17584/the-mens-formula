import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { translate } from "@/i18n";
import {
  getCatalogProduct,
  getCatalogProducts,
  getRelatedProducts,
  getSiteSettings,
} from "@/lib/catalog";
import { formatPrice, siteConfig } from "@/lib/site-config";

type Props = PageProps<"/catalogo/[slug]">;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  return product
    ? {
        title: product.name,
        description: product.description ?? undefined,
        alternates: { canonical: `/catalogo/${product.slug}` },
        openGraph: {
          images: product.main_image_url ? [product.main_image_url] : [],
        },
      }
    : {};
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  const [products, settings] = await Promise.all([
    getCatalogProducts(),
    getSiteSettings(),
  ]);
  const productUrl = `${siteConfig.url}/catalogo/${product.slug}`;
  const message = settings.whatsappProductMessage
    .replaceAll("{{product_name}}", product.name)
    .replaceAll("{{product_url}}", productUrl)
    .replace(/\s+/g, " ")
    .trim();
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : null;
  const priceLevels = [
    {
      label: translate("product.oneUnit"),
      price: product.consumer_price,
      suffix: "",
    },
    {
      label: translate("product.threePlus"),
      price: product.price_3_plus,
      suffix: " c/u",
    },
    {
      label: translate("product.sixPlus"),
      price: product.price_6_plus,
      suffix: " c/u",
    },
    { label: translate("product.box"), price: product.box_price, suffix: "" },
  ].filter((level) => level.price !== null);
  const related = getRelatedProducts(products, product);
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="shell product-page">
        <Link className="back-link" href="/catalogo">
          ← {translate("common.backToCatalog")}
        </Link>
        <div className="product-layout">
          <ProductGallery product={product} />
          <div className="product-detail">
            <p className="eyebrow">
              {product.brand.name} · {product.category.name}
            </p>
            <h1>{product.name}</h1>
            {product.description ? (
              <p className="product-description">{product.description}</p>
            ) : null}
            <div className="price-levels">
              <h2>{translate("product.prices")}</h2>
              {priceLevels.map((level) => (
                <div className="price-level" key={level.label}>
                  <span>{level.label}</span>
                  <strong>
                    {formatPrice(level.price)}
                    {level.suffix}
                  </strong>
                </div>
              ))}
            </div>
            {product.detail_points.length ? (
              <div className="detail-points">
                <h2>{translate("product.details")}</h2>
                <ul>
                  {product.detail_points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {whatsappHref ? (
              <a
                className="button button-primary"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                {translate("product.whatsapp")}{" "}
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <span className="whatsapp-unavailable">
                {translate("product.whatsappUnavailable")}
              </span>
            )}
          </div>
        </div>
        {related.length ? (
          <section className="related-products" aria-labelledby="related-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{translate("product.relatedEyebrow")}</p>
                <h2 id="related-title">{translate("product.relatedTitle")}</h2>
              </div>
              <Link className="text-link" href="/catalogo">
                {translate("home.viewCatalog")}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="product-grid related-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
