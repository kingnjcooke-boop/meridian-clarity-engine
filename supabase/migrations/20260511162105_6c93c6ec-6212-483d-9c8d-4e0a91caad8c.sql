
-- =========================
-- ROLES
-- =========================
create type public.app_role as enum ('admin', 'coach', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================
-- UPDATED_AT TRIGGER
-- =========================
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- =========================
-- PROFILES
-- =========================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  email text,
  industry text,
  niche text,
  current_stage text,
  target text,
  employers text[] default '{}',
  resume_name text,
  resume_text text,
  onboarded boolean not null default false,
  cohort_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = user_id);
create policy "Users delete own profile" on public.profiles
  for delete to authenticated using (auth.uid() = user_id);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- SCORES (append-only history)
-- =========================
create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  percentile text,
  tier text,
  trend integer default 0,
  trend_label text,
  gaps_count integer default 0,
  gaps_priority text,
  summary text,
  gaps jsonb default '[]'::jsonb,
  strengths jsonb default '[]'::jsonb,
  roadmap jsonb default '[]'::jsonb,
  input_hash text,
  created_at timestamptz not null default now()
);

create index scores_user_created_idx on public.scores(user_id, created_at desc);
create index scores_input_hash_idx on public.scores(user_id, input_hash);

alter table public.scores enable row level security;
create policy "Users view own scores" on public.scores
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own scores" on public.scores
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users delete own scores" on public.scores
  for delete to authenticated using (auth.uid() = user_id);

-- =========================
-- ACTIONS (roadmap completion)
-- =========================
create table public.actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score_id uuid references public.scores(id) on delete set null,
  title text not null,
  gap text,
  pts integer default 0,
  pts_awarded integer default 0,
  signal text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  artifact_url text,
  artifact_text text,
  feedback text,
  verified boolean default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index actions_user_status_idx on public.actions(user_id, status);

alter table public.actions enable row level security;
create policy "Users view own actions" on public.actions
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own actions" on public.actions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own actions" on public.actions
  for update to authenticated using (auth.uid() = user_id);
create policy "Users delete own actions" on public.actions
  for delete to authenticated using (auth.uid() = user_id);

create trigger actions_updated_at before update on public.actions
  for each row execute function public.update_updated_at_column();

-- =========================
-- EVENTS (activity log)
-- =========================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index events_user_created_idx on public.events(user_id, created_at desc);

alter table public.events enable row level security;
create policy "Users view own events" on public.events
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own events" on public.events
  for insert to authenticated with check (auth.uid() = user_id);

-- =========================
-- STORIES DISMISSED
-- =========================
create table public.stories_dismissed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  story_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, story_key)
);

alter table public.stories_dismissed enable row level security;
create policy "Users view own dismissed" on public.stories_dismissed
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own dismissed" on public.stories_dismissed
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users delete own dismissed" on public.stories_dismissed
  for delete to authenticated using (auth.uid() = user_id);
