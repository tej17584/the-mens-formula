create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  contact text not null check (char_length(contact) between 1 and 180),
  message text not null check (char_length(message) between 1 and 3000),
  product_id uuid references public.products(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contact_messages_status_created_at_index
  on public.contact_messages (status, created_at desc);

alter table public.admin_users enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();
