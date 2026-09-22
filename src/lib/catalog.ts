import previewProducts from "@/data/catalog-preview.json";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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
      .select(catalogSelect)
      .eq("is_active", true)
      .order("name");
    return error ? preview : normalizeProducts(data as CatalogProduct[] | null);
  } catch {
    return preview;
  }
}

export async function getCatalogProduct(slug: string) {
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
    return error || !data
      ? fromPreview
      : (normalizeProducts([data as CatalogProduct])[0] ?? null);
  } catch {
    return fromPreview;
  }
}

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
    return error || !data
      ? fallback
      : {
          whatsappNumber: data.whatsapp_number,
          whatsappProductMessage: data.whatsapp_product_message,
        };
  } catch {
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
