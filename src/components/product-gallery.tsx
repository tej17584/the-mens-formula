"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "@/i18n";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const t = useTranslations();
  const images = [
    ...new Set(
      [
        product.main_image_url,
        ...product.images.map((image) => image.image_url),
      ].filter((image): image is string => Boolean(image)),
    ),
  ];
  const [selected, setSelected] = useState(images[0]);
  return (
    <div className="product-gallery">
      <div className="gallery-main">
        {selected ? (
          <Image
            src={selected}
            alt={product.name}
            fill
            sizes="(max-width: 1023px) calc(100vw - 2rem), 38rem"
            quality={82}
            priority
          />
        ) : (
          <span className="product-monogram">TMF</span>
        )}
      </div>
      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              className={selected === image ? "selected" : ""}
              type="button"
              key={image}
              onClick={() => setSelected(image)}
              aria-label={`${t("catalog.viewProduct")}: ${index + 1} de ${product.name}`}
            >
              <Image src={image} alt="" fill sizes="72px" quality={70} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
