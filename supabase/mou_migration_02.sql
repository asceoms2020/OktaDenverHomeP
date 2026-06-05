-- =============================================================
-- MOU 마이그레이션 02 — 운영 인력 명단(mou_staff) 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- (신규 설치는 최신 mou_schema.sql 에 포함되어 불필요)
-- =============================================================
create table if not exists public.mou_staff (
  id uuid primary key default gen_random_uuid(),
  name text,
  role_group text,                   -- 봉사자 | 준비위원회 | 덴버회원
  title text,
  phone text,
  email text,
  kakao_id text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.mou_staff enable row level security;
drop policy if exists mou_staff_admin_all on public.mou_staff;
create policy mou_staff_admin_all on public.mou_staff
  for all to authenticated
  using (public.mou_is_admin()) with check (public.mou_is_admin());
