import "server-only";

import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

export type DashboardProductFilters = {
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

export type DashboardProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  stock: number | null;
  consumer_price: number | null;
  is_active: boolean;
  is_available: boolean;
  main_image_url: string | null;
  brand: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  internal: { distributor_unit_price: number | null } | null;
};

const productSelect =
  "id,slug,name,sku,stock,consumer_price,is_active,is_available,main_image_url,brand:brands(id,name,slug),category:categories(id,name,slug),internal:product_internal(distributor_unit_price)";

export async function getDashboardStats() {
  const supabase = createAdminClient();
  const [total, visible, unread] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  const error = total.error ?? visible.error ?? unread.error;
  if (error) {
    sentryErrorReport(error, "DASHBOARD_QUERY - STATS");
    return { total: 0, visible: 0, unread: 0 };
  }
  return {
    total: total.count ?? 0,
    visible: visible.count ?? 0,
    unread: unread.count ?? 0,
  };
}

export async function getDashboardProductPage(
  filters: DashboardProductFilters,
) {
  const supabase = createAdminClient();
  const pageSize = 20;
  const page = Math.max(1, Number(filters.page) || 1);
  const hasDistributorRange = Boolean(
    filters.minDistributor || filters.maxDistributor,
  );
  const select = hasDistributorRange
    ? productSelect.replace(
        "internal:product_internal(",
        "internal:product_internal!inner(",
      )
    : productSelect;
  let query = supabase
    .from("products")
    .select(select, { count: "exact" })
    .order("name", { ascending: true });

  if (filters.brand) query = query.eq("brand_id", filters.brand);
  if (filters.category) query = query.eq("category_id", filters.category);
  if (filters.visible === "true") query = query.eq("is_active", true);
  if (filters.visible === "false") query = query.eq("is_active", false);
  if (filters.minPrice)
    query = query.gte("consumer_price", Number(filters.minPrice));
  if (filters.maxPrice)
    query = query.lte("consumer_price", Number(filters.maxPrice));
  if (filters.minDistributor)
    query = query.gte(
      "product_internal.distributor_unit_price",
      Number(filters.minDistributor),
    );
  if (filters.maxDistributor)
    query = query.lte(
      "product_internal.distributor_unit_price",
      Number(filters.maxDistributor),
    );
  if (filters.q?.trim()) {
    const term = filters.q.trim().replaceAll(",", " ");
    query = query.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,sku.ilike.%${term}%`,
    );
  }
  const { data, error, count } = await query.range(
    (page - 1) * pageSize,
    page * pageSize - 1,
  );
  if (error) {
    sentryErrorReport(error, "PRODUCTS_QUERY - DASHBOARD_LIST");
    return { products: [], total: 0, page, pageSize };
  }

  return {
    products: (data ?? []) as unknown as DashboardProduct[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getDashboardReferences() {
  const supabase = createAdminClient();
  const [brands, categories, productReferences] = await Promise.all([
    supabase.from("brands").select("id,name,slug").order("name"),
    supabase.from("categories").select("id,name,slug").order("sort_order"),
    supabase.from("products").select("brand_id,category_id"),
  ]);
  if (brands.error) sentryErrorReport(brands.error, "DASHBOARD_QUERY - BRANDS");
  if (categories.error)
    sentryErrorReport(categories.error, "DASHBOARD_QUERY - CATEGORIES");
  if (productReferences.error) {
    sentryErrorReport(
      productReferences.error,
      "DASHBOARD_QUERY - REFERENCE_USAGE",
    );
  }

  const brandUsage = new Map<string, number>();
  const categoryUsage = new Map<string, number>();
  for (const product of productReferences.data ?? []) {
    brandUsage.set(
      product.brand_id,
      (brandUsage.get(product.brand_id) ?? 0) + 1,
    );
    categoryUsage.set(
      product.category_id,
      (categoryUsage.get(product.category_id) ?? 0) + 1,
    );
  }

  return {
    brands: (brands.data ?? []).map((brand) => ({
      ...brand,
      productCount: brandUsage.get(brand.id) ?? 0,
    })),
    categories: (categories.data ?? []).map((category) => ({
      ...category,
      productCount: categoryUsage.get(category.id) ?? 0,
    })),
  };
}

export async function getDashboardSiteSettings() {
  const { data, error } = await createAdminClient()
    .from("site_settings")
    .select("whatsapp_number,whatsapp_product_message")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    sentryErrorReport(error, "SITE_SETTINGS_QUERY - DASHBOARD");
    return null;
  }
  return data;
}

export async function getDashboardProduct(id: string) {
  const { data, error } = await createAdminClient()
    .from("products")
    .select(
      `${productSelect},description,short_description,detail_points,price_3_plus,price_6_plus,box_price,images:product_images(id,image_url,sort_order,alt_text)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) sentryErrorReport(error, "PRODUCTS_QUERY - DASHBOARD_DETAIL");
  return data ?? null;
}

export async function getContactMessages(page = 1, status?: string) {
  const pageSize = 20;
  let query = createAdminClient()
    .from("contact_messages")
    .select(
      "id,name,contact,message,status,created_at,product:products(name,slug)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });
  if (status === "new" || status === "read") query = query.eq("status", status);
  const { data, error, count } = await query.range(
    (page - 1) * pageSize,
    page * pageSize - 1,
  );
  if (error) {
    sentryErrorReport(error, "CONTACT_QUERY - LIST");
    return { messages: [], total: 0, page, pageSize };
  }
  return { messages: data ?? [], total: count ?? 0, page, pageSize };
}
