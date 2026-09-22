import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/site-config";

export function ProductCard({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  return (
    <article className="product-card">
      <Link className="product-media" href={`/catalogo/${product.slug}`}>
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
          />
        ) : (
          <span className="product-monogram">TMF</span>
        )}
      </Link>
      <div className="product-copy">
        <p>
          {product.brand.name} · {product.category.name}
        </p>
        <h3>
          <Link href={`/catalogo/${product.slug}`}>{product.name}</Link>
        </h3>
        <strong>{formatPrice(product.price)}</strong>
        <Link className="text-link" href={`/catalogo/${product.slug}`}>
          Ver producto <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
