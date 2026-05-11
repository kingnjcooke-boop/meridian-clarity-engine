
-- cohort_profiles: anonymized placed-candidate signals
create table public.cohort_profiles (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  niche text,
  target text not null,
  tier text not null,
  score integer not null check (score between 0 and 100),
  top_signals jsonb not null default '[]'::jsonb,
  top_gap text,
  year_placed integer,
  created_at timestamptz not null default now()
);

create index idx_cohort_profiles_lookup on public.cohort_profiles (industry, niche, target);

alter table public.cohort_profiles enable row level security;

create policy "Authenticated can read cohort profiles"
  on public.cohort_profiles for select
  to authenticated
  using (true);

-- cohort_stats: precomputed distribution
create table public.cohort_stats (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  niche text,
  target text not null,
  histogram jsonb not null default '[]'::jsonb,
  median integer,
  p25 integer,
  p75 integer,
  p90 integer,
  sample_size integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (industry, niche, target)
);

create index idx_cohort_stats_lookup on public.cohort_stats (industry, niche, target);

alter table public.cohort_stats enable row level security;

create policy "Authenticated can read cohort stats"
  on public.cohort_stats for select
  to authenticated
  using (true);

-- refresh function
create or replace function public.refresh_cohort_stats()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  hist jsonb;
  bins int[] := array[50,55,60,65,70,75,80,85,90,95,100];
  i int;
  bin_count int;
begin
  delete from public.cohort_stats;

  for rec in
    select industry, niche, target,
           count(*) as n,
           percentile_cont(0.25) within group (order by score)::int as p25,
           percentile_cont(0.50) within group (order by score)::int as p50,
           percentile_cont(0.75) within group (order by score)::int as p75,
           percentile_cont(0.90) within group (order by score)::int as p90
    from public.cohort_profiles
    group by industry, niche, target
  loop
    hist := '[]'::jsonb;
    for i in 1..(array_length(bins,1)-1) loop
      select count(*) into bin_count
      from public.cohort_profiles cp
      where cp.industry = rec.industry
        and coalesce(cp.niche,'') = coalesce(rec.niche,'')
        and cp.target = rec.target
        and cp.score >= bins[i]
        and cp.score < bins[i+1];
      hist := hist || jsonb_build_object('lo', bins[i], 'hi', bins[i+1], 'n', bin_count);
    end loop;

    insert into public.cohort_stats (industry, niche, target, histogram, median, p25, p75, p90, sample_size, updated_at)
    values (rec.industry, rec.niche, rec.target, hist, rec.p50, rec.p25, rec.p75, rec.p90, rec.n, now());
  end loop;
end;
$$;
