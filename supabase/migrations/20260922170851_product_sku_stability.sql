-- Product URLs are created from an immutable internal SKU. Existing public
-- slugs intentionally remain untouched so already shared links keep working.
update public.products
set sku = 'TMF-' || upper(replace(id::text, '-', ''))
where sku is null or btrim(sku) = '';

alter table public.products
  alter column sku set not null;
