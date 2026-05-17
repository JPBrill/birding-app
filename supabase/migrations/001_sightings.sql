-- Run this in your Supabase SQL editor

create table if not exists sightings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  species_spp    text not null,
  species_name   text not null,
  sighted_at     timestamptz not null default now(),
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  location_name  text,
  count          smallint default 1,
  notes          text,
  photo_url      text,
  created_at     timestamptz default now()
);

create index if not exists idx_sightings_user     on sightings(user_id);
create index if not exists idx_sightings_species  on sightings(species_spp);
create index if not exists idx_sightings_date     on sightings(sighted_at desc);

-- RLS: users can only see and edit their own sightings
alter table sightings enable row level security;

create policy "Own sightings" on sightings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
