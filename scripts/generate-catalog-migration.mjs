import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const workbookPath = process.argv[2];
const outputPath = process.argv[3];
const previewPath = process.argv[4];

if (!workbookPath || !outputPath) {
  throw new Error(
    "Usage: node scripts/generate-catalog-migration.mjs <workbook> <migration>",
  );
}

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const sql = (value) => `'${String(value).replaceAll("'", "''")}'`;
const categoryFor = (name) => {
  const value = name.toLowerCase();
  if (value.includes("after shave")) return "after-shave";
  if (value.includes("shaving gel")) return "afeitado";
  if (value.includes("beard") || value.includes("barba"))
    return "productos-para-barba";
  if (value.includes("mask") || value.includes("mascarilla"))
    return "cuidado-facial";
  if (value.includes("shampoo") || value.includes("minoxidil"))
    return "productos-para-cabello";
  if (value.includes("talco")) return "talcos";
  if (value.includes("enfriador") || value.includes("papel cuello"))
    return "accesorios";
  return "productos-para-cabello";
};

const categories = [
  ["after-shave", "After shave", "Productos para finalizar el afeitado.", 1],
  ["afeitado", "Afeitado", "Productos para un rasurado preciso.", 2],
  [
    "productos-para-cabello",
    "Productos para cabello",
    "Fijación, volumen y cuidado capilar.",
    3,
  ],
  [
    "productos-para-barba",
    "Productos para barba",
    "Cuidado y definición para barba y bigote.",
    4,
  ],
  ["cuidado-facial", "Cuidado facial", "Limpieza y preparación de la piel.", 5],
  ["talcos", "Talcos", "Acabados profesionales para barbería.", 6],
  ["accesorios", "Accesorios", "Complementos para el servicio profesional.", 7],
];

const book = XLSX.readFile(workbookPath);
const records = [];
for (const sheetName of book.SheetNames) {
  const rows = XLSX.utils.sheet_to_json(book.Sheets[sheetName], {
    defval: null,
  });
  const brandSlug = slugify(sheetName);
  for (const row of rows) {
    const name = row["NOMBRE DE PRODUCTOS"];
    if (!name) continue;
    const price = Number(
      row["PRECIO A CONSUMIDOR FINAL"] ?? row["PRECIO A CONSUMIDOR FINAL "],
    );
    const publicPrice = Number.isFinite(price)
      ? price
      : Number(row["PRECIO A CONSUMIDOR FINAL"]);
    const resolvedPrice = Number.isFinite(publicPrice)
      ? publicPrice
      : Number(
          row["PRECIO A CONSUMIDOR FINAL"] ?? row["PRECIO A CONSUMIDOR FINAL "],
        );
    const sheetFourByFour = sheetName === "4x4";
    const fallbackPrice = sheetFourByFour
      ? Number(row["PRECIO A CONSUMIDOR FINAL"])
      : resolvedPrice;
    const finalPrice = Number.isFinite(fallbackPrice) ? fallbackPrice : null;
    const summary = row["__EMPTY"] ?? row["System.Xml.XmlElement"] ?? "";
    const details = row["DETALLE"] ?? "";
    records.push({
      brand: sheetName,
      brandSlug,
      name,
      slug: `${brandSlug}-${slugify(name)}`,
      category: categoryFor(name),
      price: finalPrice,
      description: details || summary,
      shortDescription: summary || details,
    });
  }
}

const uniqueBrands = [
  ...new Map(records.map((record) => [record.brandSlug, record])).values(),
];
const productRows = records
  .map(
    (record) =>
      `  (${sql(record.name)}, ${sql(record.slug)}, ${sql(record.description)}, ${sql(record.shortDescription)}, (select id from categories where slug = ${sql(record.category)}), (select id from brands where slug = ${sql(record.brandSlug)}), ${record.price ?? "null"}, ${sql(`/catalogo/${record.brandSlug}/${record.slug}.webp`)}, true, true)`,
  )
  .join(",\n");

const contents = `-- Generated from ${path.basename(workbookPath)}. Do not edit product rows by hand; regenerate this migration before it is applied.\n\ncreate extension if not exists pgcrypto;\n\ncreate table if not exists public.categories (\n  id uuid primary key default gen_random_uuid(),\n  name text not null,\n  slug text not null unique,\n  description text,\n  image_url text,\n  is_active boolean not null default true,\n  sort_order integer not null default 0,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists public.brands (\n  id uuid primary key default gen_random_uuid(),\n  name text not null,\n  slug text not null unique,\n  logo_url text,\n  is_active boolean not null default true,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists public.products (\n  id uuid primary key default gen_random_uuid(),\n  name text not null,\n  slug text not null unique,\n  description text,\n  short_description text,\n  category_id uuid not null references public.categories(id),\n  brand_id uuid not null references public.brands(id),\n  price numeric(12, 2),\n  sku text unique,\n  stock integer,\n  sale_price numeric(12, 2),\n  cost numeric(12, 2),\n  featured boolean not null default false,\n  is_new boolean not null default false,\n  color text,\n  model text,\n  specifications jsonb not null default '{}'::jsonb,\n  main_image_url text,\n  is_active boolean not null default true,\n  is_available boolean not null default true,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists public.product_images (\n  id uuid primary key default gen_random_uuid(),\n  product_id uuid not null references public.products(id) on delete cascade,\n  image_url text not null,\n  alt_text text,\n  sort_order integer not null default 0,\n  created_at timestamptz not null default now(),\n  unique (product_id, sort_order)\n);\n\ncreate index if not exists products_catalog_index on public.products (is_active, is_available, category_id, brand_id);\ncreate index if not exists products_slug_index on public.products (slug);\ncreate index if not exists product_images_product_index on public.product_images (product_id, sort_order);\n\ncreate or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;\n\ndrop trigger if exists categories_set_updated_at on public.categories;\ncreate trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();\ndrop trigger if exists brands_set_updated_at on public.brands;\ncreate trigger brands_set_updated_at before update on public.brands for each row execute function public.set_updated_at();\ndrop trigger if exists products_set_updated_at on public.products;\ncreate trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();\n\nalter table public.categories enable row level security;\nalter table public.brands enable row level security;\nalter table public.products enable row level security;\nalter table public.product_images enable row level security;\n\ncreate policy \"Public can read active categories\" on public.categories for select to anon, authenticated using (is_active);\ncreate policy \"Public can read active brands\" on public.brands for select to anon, authenticated using (is_active);\ncreate policy \"Public can read active products\" on public.products for select to anon, authenticated using (is_active);\ncreate policy \"Public can read product images\" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products where products.id = product_images.product_id and products.is_active));\n\ngrant select on public.categories, public.brands, public.products, public.product_images to anon, authenticated;\n\ninsert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do update set public = excluded.public;\ncreate policy \"Public can view product media\" on storage.objects for select to anon, authenticated using (bucket_id = 'products');\n\ninsert into public.categories (slug, name, description, sort_order) values\n${categories.map(([slug, name, description, order]) => `  (${sql(slug)}, ${sql(name)}, ${sql(description)}, ${order})`).join(",\n")}\non conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;\n\ninsert into public.brands (name, slug) values\n${uniqueBrands.map((brand) => `  (${sql(brand.brand)}, ${sql(brand.brandSlug)})`).join(",\n")}\non conflict (slug) do update set name = excluded.name;\n\ninsert into public.products (name, slug, description, short_description, category_id, brand_id, price, main_image_url, is_active, is_available) values\n${productRows}\non conflict (slug) do update set name = excluded.name, description = excluded.description, short_description = excluded.short_description, category_id = excluded.category_id, brand_id = excluded.brand_id, price = excluded.price, main_image_url = excluded.main_image_url, is_active = excluded.is_active, is_available = excluded.is_available;\n`;

await fs.writeFile(outputPath, contents, "utf8");
if (previewPath) {
  await fs.mkdir(path.dirname(previewPath), { recursive: true });
  await fs.writeFile(
    previewPath,
    JSON.stringify(
      records.map((record) => ({
        ...record,
        mainImageUrl: `/catalogo/${record.brandSlug}/${record.slug}.webp`,
        isAvailable: true,
      })),
      null,
      2,
    ),
    "utf8",
  );
}
console.log(`Wrote ${records.length} products to ${outputPath}`);
