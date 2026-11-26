export type CatalogQuery = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: number;
};

export function catalogSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === "string" && item.trim());
    return first?.trim() || undefined;
  }
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizeCatalogSlug(value: string | undefined) {
  const slug = value?.trim().toLowerCase();
  return slug || undefined;
}

export function applyCatalogQuery<
  T extends {
    name: string;
    category: { slug: string };
    brand: { slug: string };
  },
>(products: T[], query: CatalogQuery) {
  const search = query.q?.trim().toLowerCase();
  const category = normalizeCatalogSlug(query.category);
  const brand = normalizeCatalogSlug(query.brand);
  return products.filter((product) => {
    if (category && product.category.slug !== category) return false;
    if (brand && product.brand.slug !== brand) return false;
    if (search && !product.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

export function sortCatalogProducts<
  T extends { name: string; consumer_price: number | null },
>(products: T[], sort?: string) {
  const sorted = [...products];
  if (sort === "price-asc") {
    sorted.sort(
      (first, second) =>
        (first.consumer_price ?? Number.POSITIVE_INFINITY) -
        (second.consumer_price ?? Number.POSITIVE_INFINITY),
    );
  } else if (sort === "price-desc") {
    sorted.sort(
      (first, second) =>
        (second.consumer_price ?? Number.NEGATIVE_INFINITY) -
        (first.consumer_price ?? Number.NEGATIVE_INFINITY),
    );
  } else if (sort === "name-desc") {
    sorted.sort((first, second) => second.name.localeCompare(first.name, "es"));
  } else {
    sorted.sort((first, second) => first.name.localeCompare(second.name, "es"));
  }
  return sorted;
}

export function paginateCatalog<T>(
  products: T[],
  pageSize: number,
  requestedPage: number,
) {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  return {
    products: products.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
  };
}
