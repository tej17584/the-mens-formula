create table public.dashboard_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index dashboard_sessions_user_id_index
  on public.dashboard_sessions (user_id);

alter table public.dashboard_sessions enable row level security;

revoke all on public.dashboard_sessions from anon, authenticated;
