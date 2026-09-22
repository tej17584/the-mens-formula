import previewProducts from "@/data/catalog-preview.json";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sentryErrorReport } from "@/lib/sentry";
import { createClient } from "@/lib/supabase/server";

export type CatalogCategory = { id: string; name: string; slug: string };
export type CatalogBrand = { id: string; name: string; slug: string };
export type CatalogImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
};
export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  detail_points: string[];
  consumer_price: number | null;
  price_3_plus: number | null;
  price_6_plus: number | null;
  box_price: number | null;
  main_image_url: string | null;
  is_available: boolean;
  category: CatalogCategory;
  brand: CatalogBrand;
  images: CatalogImage[];
};
export type SiteSettings = {
  whatsappNumber: string | null;
  whatsappProductMessage: string;
};

const catalogSelect =
  "id,name,slug,description,short_description,detail_points,consumer_price,price_3_plus,price_6_plus,box_price,main_image_url,is_available,category:categories(id,name,slug),brand:brands(id,name,slug),images:product_images(id,image_url,alt_text,sort_order)";
const catalogCardSelect =
  "id,name,slug,consumer_price,price_3_plus,price_6_plus,box_price,main_image_url,is_available,category:categories(id,name,slug),brand:brands(id,name,slug)";

function categoryName(slug: string) {
  return slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const preview = previewProducts.map((product, index) => ({
  id: `preview-${index}`,
  name: product.name,
  slug: product.slug,
  description: product.description || null,
  short_description: product.shortDescription || null,
  detail_points: [],
  consumer_price: product.price ?? null,
  price_3_plus: null,
  price_6_plus: null,
  box_price: null,
  main_image_url: null,
  is_available: product.isAvailable,
  category: {
    id: product.category,
    slug: product.category,
    name: categoryName(product.category),
  },
  brand: {
    id: product.brandSlug,
    slug: product.brandSlug,
    name: product.brand,
  },
  images: [],
})) satisfies CatalogProduct[];

function normalizeProducts(data: CatalogProduct[] | null) {
  return (data ?? []).map((product) => ({
    ...product,
    images: [...(product.images ?? [])].sort(
      (first, second) => first.sort_order - second.sort_order,
    ),
    detail_points: product.detail_points ?? [],
    main_image_url: product.main_image_url?.startsWith("/catalogo/")
      ? null
      : product.main_image_url,
  }));
}

export async function getCatalogProducts() {
  if (!isSupabaseConfigured()) return preview;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(catalogCardSelect)
      .eq("is_active", true)
      .order("name");
    if (error) {
      sentryErrorReport(error, "PRODUCTS_QUERY - LIST");
      return preview;
    }
    return normalizeProducts(data as CatalogProduct[] | null);
  } catch (error) {
    sentryErrorReport(error, "PRODUCTS_QUERY - LIST");
    return preview;
  }
}

export type CatalogQuery = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: number;
};

function normalizeCards(data: unknown) {
  return normalizeProducts((data ?? []) as CatalogProduct[]);
}

export async function getCatalogPage(query: CatalogQuery) {
  const pageSize = 30;
  const requestedPage = Math.max(1, query.page ?? 1);
  if (!isSupabaseConfigured()) {
    const sorted = [...preview].sort((first, second) =>
      first.name.localeCompare(second.name, "es"),
    );
    return {
      products: sorted.slice(
        (requestedPage - 1) * pageSize,
        requestedPage * pageSize,
      ),
      total: sorted.length,
      page: requestedPage,
      pageSize,
    };
  }
  try {
    const supabase = await createClient();
    let categoryId: string | undefined;
    let brandId: string | undefined;
    if (query.category) {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", query.category)
        .maybeSingle();
      if (error) throw error;
      if (!data) return { products: [], total: 0, page: 1, pageSize };
      categoryId = data.id;
    }
    if (query.brand) {
      const { data, error } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", query.brand)
        .maybeSingle();
      if (error) throw error;
      if (!data) return { products: [], total: 0, page: 1, pageSize };
      brandId = data.id;
    }
    const search = query.q
      ?.trim()
      .replaceAll("%", "\\%")
      .replaceAll("_", "\\_");
    let countQuery = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if (categoryId) countQuery = countQuery.eq("category_id", categoryId);
    if (brandId) countQuery = countQuery.eq("brand_id", brandId);
    if (search) countQuery = countQuery.ilike("name", `%${search}%`);
    const { count, error: countError } = await countQuery;
    if (countError) throw countError;
    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(requestedPage, totalPages);

    let productsQuery = supabase
      .from("products")
      .select(catalogCardSelect)
      .eq("is_active", true);
    if (categoryId) productsQuery = productsQuery.eq("category_id", categoryId);
    if (brandId) productsQuery = productsQuery.eq("brand_id", brandId);
    if (search) productsQuery = productsQuery.ilike("name", `%${search}%`);
    if (query.sort === "price-asc")
      productsQuery = productsQuery.order("consumer_price", {
        ascending: true,
        nullsFirst: false,
      });
    else if (query.sort === "price-desc")
      productsQuery = productsQuery.order("consumer_price", {
        ascending: false,
        nullsFirst: false,
      });
    else if (query.sort === "name-desc")
      productsQuery = productsQuery.order("name", { ascending: false });
    else productsQuery = productsQuery.order("name", { ascending: true });
    const { data, error } = await productsQuery.range(
      (page - 1) * pageSize,
      page * pageSize - 1,
    );
    if (error) throw error;
    return {
      products: normalizeCards(data),
      total,
      page,
      pageSize,
    };
  } catch (error) {
    sentryErrorReport(error, "PRODUCTS_QUERY - CATALOG_PAGE");
    return { products: [], total: 0, page: requestedPage, pageSize };
  }
}

export async function getCatalogFilters() {
  if (!isSupabaseConfigured()) {
    return {
      categories: [
        ...new Map(
          preview.map((product) => [product.category.slug, product.category]),
        ).values(),
      ],
      brands: [
        ...new Map(
          preview.map((product) => [product.brand.slug, product.brand]),
        ).values(),
      ],
    };
  }
  try {
    const supabase = await createClient();
    const [categories, brands] = await Promise.all([
      supabase
        .from("categories")
        .select("name,slug")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("brands")
        .select("name,slug")
        .eq("is_active", true)
        .order("name"),
    ]);
    if (categories.error) throw categories.error;
    if (brands.error) throw brands.error;
    return { categories: categories.data ?? [], brands: brands.data ?? [] };
  } catch (error) {
    sentryErrorReport(error, "CATALOG_QUERY - FILTERS");
    return { categories: [], brands: [] };
  }
}

export const getCatalogProduct = cache(async (slug: string) => {
  const fromPreview = preview.find((product) => product.slug === slug) ?? null;
  if (!isSupabaseConfigured()) return fromPreview;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(catalogSelect)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) sentryErrorReport(error, "PRODUCTS_QUERY - DETAIL");
    return error || !data
      ? fromPreview
      : (normalizeProducts([data as CatalogProduct])[0] ?? null);
  } catch (error) {
    sentryErrorReport(error, "PRODUCTS_QUERY - DETAIL");
    return fromPreview;
  }
});

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback = {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
    whatsappProductMessage:
      'Hola, me interesa "{{product_name}}". Quisiera más información sobre este producto. {{product_url}}',
  };
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("whatsapp_number,whatsapp_product_message")
      .eq("id", 1)
      .maybeSingle();
    if (error) sentryErrorReport(error, "SITE_SETTINGS_QUERY");
    return error || !data
      ? fallback
      : {
          whatsappNumber: data.whatsapp_number,
          whatsappProductMessage: data.whatsapp_product_message,
        };
  } catch (error) {
    sentryErrorReport(error, "SITE_SETTINGS_QUERY");
    return fallback;
  }
}

export function getRelatedProducts(
  products: CatalogProduct[],
  product: CatalogProduct,
  limit = 4,
) {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .sort(
      (first, second) =>
        Number(second.category.id === product.category.id) -
          Number(first.category.id === product.category.id) ||
        Number(second.brand.id === product.brand.id) -
          Number(first.brand.id === product.brand.id),
    )
    .slice(0, limit);
}

export function getDiverseProducts(products: CatalogProduct[], limit = 4) {
  const selected: CatalogProduct[] = [];
  const ordered = [...products].sort(
    (first, second) =>
      Number(Boolean(second.main_image_url)) -
      Number(Boolean(first.main_image_url)),
  );
  for (const product of ordered) {
    if (!selected.some((item) => item.category.slug === product.category.slug))
      selected.push(product);
    if (selected.length === limit) break;
  }
  for (const product of ordered) {
    if (!selected.some((item) => item.id === product.id))
      selected.push(product);
    if (selected.length === limit) break;
  }
  return selected;
}
