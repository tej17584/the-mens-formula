import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const [workbookPath, outputPath] = process.argv.slice(2);
if (!workbookPath || !outputPath) {
  throw new Error(
    "Usage: node scripts/generate-catalog-refresh-migration.mjs <workbook> <migration>",
  );
}

const normalizeHeader = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
const slugify = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const getColumn = (row, header) => {
  const target = normalizeHeader(header);
  const found = Object.keys(row).find((key) => normalizeHeader(key) === target);
  return found ? row[found] : null;
};
const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};
const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sqlNumber = (value) => (value === null ? "null" : String(value));
const sqlTextArray = (values) =>
  values.length
    ? `array[${values.map(sqlString).join(", ")}]::text[]`
    : "array[]::text[]";
const detailPoints = (detail) =>
  String(detail ?? "")
    .split(/(?<=[.!?])\s+/u)
    .map((point) => point.trim())
    .filter(Boolean);

const workbook = XLSX.readFile(workbookPath);
const records = [];
for (const brand of workbook.SheetNames) {
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[brand], {
    defval: null,
  });
  for (const row of rows) {
    const name = getColumn(row, "NOMBRE DE PRODUCTOS");
    if (!name) continue;
    records.push({
      slug: `${slugify(brand)}-${slugify(name)}`,
      description: getColumn(row, "DESCRIPCIÓN") || null,
      detailPoints: detailPoints(getColumn(row, "DETALLE")),
      consumerPrice: numberOrNull(getColumn(row, "PRECIO A CONSUMIDOR FINAL")),
      price3Plus: numberOrNull(getColumn(row, "PRECIO DE 3 EN ADELANTE")),
      price6Plus: numberOrNull(getColumn(row, "PRECIO DE 6 EN ADELANTE")),
      boxPrice: numberOrNull(getColumn(row, "PRECIO POR CAJA")),
      distributorPrice: numberOrNull(
        getColumn(row, "PRECIO UNIDAD DISTRIBUIDOR"),
      ),
    });
  }
}

const updates = records
  .map(
    (record) => `update public.products set
  description = ${record.description ? sqlString(record.description) : "null"},
  short_description = ${record.description ? sqlString(record.description) : "null"},
  detail_points = ${sqlTextArray(record.detailPoints)},
  consumer_price = ${sqlNumber(record.consumerPrice)},
  price_3_plus = ${sqlNumber(record.price3Plus)},
  price_6_plus = ${sqlNumber(record.price6Plus)},
  box_price = ${sqlNumber(record.boxPrice)},
  price = ${sqlNumber(record.consumerPrice)}
where slug = ${sqlString(record.slug)};\n
insert into public.product_internal (product_id, distributor_unit_price)
select id, ${sqlNumber(record.distributorPrice)} from public.products where slug = ${sqlString(record.slug)}
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();`,
  )
  .join("\n\n");

const migration = `-- Generated from ${path.basename(workbookPath)}. Maps values by normalized header names, never positions.

alter table public.products
  add column if not exists detail_points text[] not null default array[]::text[],
  add column if not exists consumer_price numeric(14, 2),
  add column if not exists price_3_plus numeric(14, 2),
  add column if not exists price_6_plus numeric(14, 2),
  add column if not exists box_price numeric(14, 2);

create table if not exists public.product_internal (
  product_id uuid primary key references public.products(id) on delete cascade,
  distributor_unit_price numeric(14, 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  whatsapp_number text,
  whatsapp_product_message text not null default 'Hola, me interesa "{{product_name}}". Quisiera más información sobre este producto. {{product_url}}',
  updated_at timestamptz not null default now()
);

alter table public.product_internal enable row level security;
alter table public.site_settings enable row level security;

drop trigger if exists product_internal_set_updated_at on public.product_internal;
create trigger product_internal_set_updated_at before update on public.product_internal for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

revoke all on public.product_internal from anon, authenticated;
revoke all on public.products from anon, authenticated;
grant select (id, name, slug, description, short_description, detail_points, category_id, brand_id, consumer_price, price_3_plus, price_6_plus, box_price, main_image_url, is_active, is_available, featured, is_new, color, model, specifications, created_at, updated_at) on public.products to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

${updates}
`;

await fs.writeFile(outputPath, migration, "utf8");
console.log(
  `Wrote ${records.length} normalized product updates to ${outputPath}`,
);
