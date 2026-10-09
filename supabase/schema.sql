-- Rappi Crew · esquema de Supabase para el prototipo.
-- Cada tabla guarda la entidad completa en `data` (jsonb). Ejecuta este archivo en el SQL Editor de Supabase.

create table if not exists public.crew_protocols (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crew_experiences (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crew_help_requests (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crew_clusters (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crew_incidents (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Políticas abiertas SOLO PARA DEMO: cualquiera con la anon key puede leer y escribir.
-- Antes de usar datos reales, reemplázalas por políticas basadas en Supabase Auth y roles.
do $$
declare t text;
begin
  foreach t in array array['crew_protocols','crew_experiences','crew_help_requests','crew_clusters','crew_incidents'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "demo_select" on public.%I', t);
    execute format('drop policy if exists "demo_insert" on public.%I', t);
    execute format('drop policy if exists "demo_update" on public.%I', t);
    execute format('create policy "demo_select" on public.%I for select using (true)', t);
    execute format('create policy "demo_insert" on public.%I for insert with check (true)', t);
    execute format('create policy "demo_update" on public.%I for update using (true)', t);
  end loop;
end $$;
