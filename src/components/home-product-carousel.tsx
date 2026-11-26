"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/catalog";

export function HomeProductCarousel({
  products,
}: {
  products: CatalogProduct[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    watchResize: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncButtons();
    emblaApi.on("select", syncButtons);
    emblaApi.on("reInit", syncButtons);
    const viewport = emblaApi.rootNode();
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && viewport
        ? new ResizeObserver(() => {
            emblaApi.reInit();
          })
        : null;
    if (resizeObserver && viewport) {
      resizeObserver.observe(viewport);
    }
    return () => {
      emblaApi.off("select", syncButtons);
      emblaApi.off("reInit", syncButtons);
      resizeObserver?.disconnect();
    };
  }, [emblaApi, syncButtons]);

  const showControls = canPrev || canNext;

  return (
    <div
      className="home-product-carousel"
      aria-roledescription="carousel"
      aria-label="Productos destacados"
    >
      <div className="home-product-carousel-viewport" ref={emblaRef}>
        <ul className="home-product-carousel-track">
          {products.map((product, index) => (
            <li
              className="home-product-carousel-slide"
              key={product.id}
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${products.length}`}
            >
              <ProductCard product={product} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>
      {showControls ? (
        <div className="home-product-carousel-controls">
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={!canPrev}
            className="home-product-carousel-control"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Producto anterior"
          >
            <ChevronLeftIcon data-icon="inline-start" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={!canNext}
            className="home-product-carousel-control"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Siguiente producto"
          >
            <ChevronRightIcon data-icon="inline-start" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}