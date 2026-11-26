import Image from "next/image";
import type { CatalogProduct } from "@/lib/catalog";

export function HeroShowcaseStage({
  products,
}: {
  products: CatalogProduct[];
}) {
  const featured = products.filter((p) => p.main_image_url).slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <div className="hero-showcase-stage" aria-hidden="true">
      {featured.map((product, index) => (
        <div
          className={`hero-showcase-piece hero-showcase-piece-${index + 1}`}
          key={product.id}
        >
          <Image
            src={product.main_image_url!}
            alt=""
            width={380}
            height={440}
            className="hero-showcase-image"
            sizes="(min-width: 900px) 220px, 42vw"
            unoptimized
            priority={index < 2}
          />
        </div>
      ))}
    </div>
  );
}