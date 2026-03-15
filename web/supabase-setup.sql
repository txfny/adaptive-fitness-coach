-- Snapshots (daily check-ins)
create table if not exists snapshots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  hrv_ms numeric not null,
  rhr_bpm numeric not null,
  rhr_7day_avg numeric,
  rhr_delta numeric,
  sleep_hours numeric not null,
  subjective_energy integer not null,
  pill_pack_day integer,
  pill_phase text,
  symptoms jsonb default '{}',
  symptom_load integer default 0,
  mood integer,
  equipment_available text not null default 'home_gym',
  soreness jsonb default '{}',
  notes text,
  readiness_tier text,
  readiness_reasoning jsonb,
  readiness_summary text
);

-- Post-session logs
create table if not exists logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  snapshot_id uuid references snapshots(id),
  overall_rpe integer not null,
  energy_after integer,
  prediction_accuracy text not null,
  hr_at_stop integer,
  hr_1min_recovery integer,
  hrr_delta integer,
  hrr_assessment text,
  notes text
);

-- RLS: allow all operations with the anon key (single-user app)
alter table snapshots enable row level security;
alter table logs enable row level security;

create policy "Allow all access to snapshots" on snapshots
  for all using (true) with check (true);

create policy "Allow all access to logs" on logs
  for all using (true) with check (true);
