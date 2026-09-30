import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { translate } from "@/i18n";
import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/site-config";

export function ProductCard({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  const hasVolumePrices =
    product.price_3_plus !== null ||
    product.price_6_plus !== null ||
    product.box_price !== null;
  return (
    <article className="product-card">
      <Link className="product-media" href={`/catalogo/${product.slug}`}>
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 26vw, 18vw"
            quality={80}
            priority={priority}
          />
        ) : (
          <span className="product-monogram">TMF</span>
        )}
      </Link>
      <div className="product-copy">
        <p>
          <Link
            className="product-brand-link"
            href={`/catalogo?marca=${product.brand.slug}`}
          >
            {product.brand.name}
          </Link>{" "}
          · {product.category.name}
        </p>
        <h3>
          <Link href={`/catalogo/${product.slug}`}>{product.name}</Link>
        </h3>
        {!product.is_available ? (
          <Badge variant="secondary">{translate("catalog.unavailable")}</Badge>
        ) : null}
        <div className="card-price">
          <span>{translate("catalog.unitPrice")}</span>
          <strong>{formatPrice(product.consumer_price)}</strong>
        </div>
        {hasVolumePrices ? (
          <span className="volume-badge">
            {translate("catalog.volumePrices")}
          </span>
        ) : null}
        <Button
          className="text-link product-view"
          nativeButton={false}
          render={<Link href={`/catalogo/${product.slug}`} />}
          variant="link"
        >
          {translate("catalog.viewProduct")}{" "}
          <span aria-hidden="true" data-icon="inline-end">
            →
          </span>
        </Button>
      </div>
    </article>
  );
}
