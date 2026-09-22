import previewProducts from "@/data/catalog-preview.json";
import availableProductImages from "@/data/available-product-images.json";
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
  price: number | null;
  main_image_url: string | null;
  is_available: boolean;
  category: CatalogCategory;
  brand: CatalogBrand;
  images: CatalogImage[];
};

type QueryResult = { data: unknown; error: { message: string } | null };
type CatalogQuery = PromiseLike<QueryResult> & {
  eq(column: string, value: unknown): CatalogQuery;
  order(column: string, options?: { ascending?: boolean }): CatalogQuery;
  maybeSingle(): Promise<QueryResult>;
};
type CatalogClient = {
  from(table: string): { select(columns: string): CatalogQuery };
};

const preview = previewProducts.map((product, index) => ({
  id: `preview-${index}`,
  name: product.name,
  slug: product.slug,
  description: product.description || null,
  short_description: product.shortDescription || null,
  price: product.price ?? null,
  main_image_url: availableProductImages.includes(product.mainImageUrl)
    ? product.mainImageUrl
    : null,
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

function categoryName(slug: string) {
  return slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function asProducts(data: unknown): CatalogProduct[] {
  return Array.isArray(data)
    ? (data as CatalogProduct[]).map((product) => ({
        ...product,
        main_image_url:
          product.main_image_url?.startsWith("/catalogo/") &&
          !availableProductImages.includes(product.main_image_url)
            ? null
            : product.main_image_url,
      }))
    : [];
}

export async function getCatalogProducts() {
  if (!isSupabaseConfigured()) return preview;

  try {
    const supabase = (await createClient()) as unknown as CatalogClient;
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,slug,description,short_description,price,main_image_url,is_available,category:categories(id,name,slug),brand:brands(id,name,slug),images:product_images(id,image_url,alt_text,sort_order)",
      )
      .eq("is_active", true)
      .order("name");
    return error ? preview : asProducts(data);
  } catch {
    return preview;
  }
}

export async function getCatalogProduct(slug: string) {
  const fromPreview = preview.find((product) => product.slug === slug);
  if (!isSupabaseConfigured()) return fromPreview ?? null;

  try {
    const supabase = (await createClient()) as unknown as CatalogClient;
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,slug,description,short_description,price,main_image_url,is_available,category:categories(id,name,slug),brand:brands(id,name,slug),images:product_images(id,image_url,alt_text,sort_order)",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    return error || !data ? (fromPreview ?? null) : (data as CatalogProduct);
  } catch {
    return fromPreview ?? null;
  }
}
