-- The public route is a stable derivative of the generated internal SKU.
-- Product names remain independently editable without changing URLs.
update public.products
set slug = lower(
  regexp_replace(
    regexp_replace(sku, '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  )
);
