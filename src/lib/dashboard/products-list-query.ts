export type DashboardProductsSearchParams = {
  page?: number;
  q?: string;
  brand?: string;
  category?: string;
  visible?: string;
  minPrice?: string;
  maxPrice?: string;
  minDistributor?: string;
  maxDistributor?: string;
};

export function stringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export function parseDashboardProductsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): DashboardProductsSearchParams {
  return {
    page: Number(stringParam(raw.page)) || 1,
    q: stringParam(raw.q),
    brand: stringParam(raw.brand),
    category: stringParam(raw.category),
    visible: stringParam(raw.visible),
    minPrice: stringParam(raw.minPrice),
    maxPrice: stringParam(raw.maxPrice),
    minDistributor: stringParam(raw.minDistributor),
    maxDistributor: stringParam(raw.maxDistributor),
  };
}

export function buildDashboardProductsPath(
  pathname: string,
  params: URLSearchParams,
  updates: Record<string, string | null | undefined>,
) {
  const next = new URLSearchParams(params.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  next.delete("page");
  return next.size ? `${pathname}?${next}` : pathname;
}
