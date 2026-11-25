alter table public.site_settings
  add column if not exists instagram_url text,
  add column if not exists facebook_url text,
  add column if not exists tiktok_url text;

update public.site_settings
set
  instagram_url = coalesce(
    nullif(instagram_url, ''),
    'https://www.instagram.com/themensformulagt'
  ),
  facebook_url = coalesce(
    nullif(facebook_url, ''),
    'https://www.facebook.com/share/1EL1L8pdwk/'
  ),
  tiktok_url = coalesce(
    nullif(tiktok_url, ''),
    'https://www.tiktok.com/@themensformula'
  )
where id = 1;
