-- Restrict public Storage reads to media for storefront-active products.
drop policy if exists "Public can view product media" on storage.objects;
create policy "Public can view active product media"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'products'
    and exists (
      select 1
      from public.products p
      where p.id::text = (storage.foldername (name))[1]
        and p.is_active = true
    )
  );

alter table public.contact_messages
  add column if not exists source_ip text;

create index if not exists contact_messages_source_ip_created_at_idx
  on public.contact_messages (source_ip, created_at desc);