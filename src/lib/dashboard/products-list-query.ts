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

const inventoryFilterKeys = [
  "q",
  "brand",
  "category",
  "visible",
  "minPrice",
  "maxPrice",
  "minDistributor",
  "maxDistributor",
] as const;

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

export function dashboardProductsListPath(
  raw: Record<string, string | string[] | undefined>,
  options?: { status?: string; page?: number },
) {
  const params = new URLSearchParams();
  for (const key of inventoryFilterKeys) {
    const value = stringParam(raw[key]);
    if (value) params.set(key, value);
  }
  if (options?.page && options.page > 1) {
    params.set("page", String(options.page));
  }
  if (options?.status) params.set("status", options.status);
  const query = params.toString();
  return `/dashboard/products${query ? `?${query}` : ""}`;
}

export function withDashboardFlashStatus(
  listPath: string,
  status: string,
) {
  const [pathname, search = ""] = listPath.split("?");
  const params = new URLSearchParams(search);
  params.set("status", status);
  const query = params.toString();
  return `${pathname}?${query}`;
}
