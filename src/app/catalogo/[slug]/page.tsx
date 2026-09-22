import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProduct } from "@/lib/catalog";
import { formatPrice, siteConfig } from "@/lib/site-config";
type Props = PageProps<"/catalogo/[slug]">;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  return product
    ? {
        title: product.name,
        description:
          product.short_description ?? product.description ?? undefined,
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
  const whatsappMessage = `Hola, me interesa el producto ${product.name} que vi en su catálogo.`;
  const queryHref = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : "/contacto";
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="shell product-page">
        <Link className="back-link" href="/catalogo">
          ← Volver al catálogo
        </Link>
        <div className="product-layout">
          <ProductGallery product={product} />
          <div className="product-detail">
            <p className="eyebrow">
              {product.brand.name} · {product.category.name}
            </p>
            <h1>{product.name}</h1>
            <p className="product-price">{formatPrice(product.price)}</p>
            <p className="availability">
              {product.is_available
                ? "Disponible para consulta"
                : "Consulta disponibilidad"}
            </p>
            <div className="product-description">
              <p>{product.description ?? product.short_description}</p>
            </div>
            <a
              className="button button-primary"
              href={queryHref}
              target={siteConfig.contact.whatsapp ? "_blank" : undefined}
              rel={siteConfig.contact.whatsapp ? "noreferrer" : undefined}
            >
              Consultar producto <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
