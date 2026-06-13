-- =============================================================
-- MOU 마이그레이션 09 — 개회식 자리배치 테이블(mou_seating_tables)
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- =============================================================
create table if not exists public.mou_seating_tables (
  id uuid primary key default gen_random_uuid(),
  label text,
  kind text default 'normal',        -- normal | staff | vip
  capacity int default 8,
  occupant_ids uuid[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.mou_seating_tables enable row level security;
drop policy if exists mou_seating_tables_admin_all on public.mou_seating_tables;
create policy mou_seating_tables_admin_all on public.mou_seating_tables
  for all to authenticated
  using (public.mou_is_admin()) with check (public.mou_is_admin());
