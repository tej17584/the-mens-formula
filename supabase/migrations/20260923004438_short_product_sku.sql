create sequence public.product_sku_sequence
  start with 1
  increment by 1
  minvalue 1;

with numbered_products as (
  select
    id,
    row_number() over (order by created_at, id) as sku_number
  from public.products
)
update public.products as product
set
  sku = 'TMF-' || lpad(numbered_products.sku_number::text, 4, '0'),
  slug = 'tmf-' || lpad(numbered_products.sku_number::text, 4, '0')
from numbered_products
where product.id = numbered_products.id;

select setval(
  'public.product_sku_sequence',
  (select count(*) from public.products),
  true
);

create or replace function public.assign_product_identity()
returns trigger
language plpgsql
as $$
declare
  sku_number bigint;
begin
  if tg_op = 'INSERT' then
    sku_number := nextval('public.product_sku_sequence');
    new.sku := 'TMF-' || case
      when sku_number < 10000 then lpad(sku_number::text, 4, '0')
      else sku_number::text
    end;
    new.slug := lower(new.sku);
  else
    -- SKU and public URL are immutable once a product exists.
    new.sku := old.sku;
    new.slug := old.slug;
  end if;
  return new;
end;
$$;

revoke all on function public.assign_product_identity() from public;

drop trigger if exists products_assign_identity on public.products;
create trigger products_assign_identity
before insert or update on public.products
for each row
execute function public.assign_product_identity();
