-- =============================================================
-- MOU 이벤트 관리 — Supabase 스키마 + RLS
-- Supabase 대시보드 > SQL Editor 에서 1회 실행하세요.
-- (관리자 = profiles.role = 'admin')
-- =============================================================

-- 관리자 판별 함수 (RLS 재귀 방지를 위해 SECURITY DEFINER 사용)
create or replace function public.mou_is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- -------------------------------------------------------------
-- 1) 참가자 마스터
-- -------------------------------------------------------------
create table if not exists public.mou_participants (
  id uuid primary key default gen_random_uuid(),
  name_ko text,
  name_en text,
  chapter text,
  position text,
  member_type text,                 -- 정회원 | 동반자 | 차세대 | 차세대봉사자 | 덴버
  has_companion boolean default false,
  companion_name text,
  companion_count int default 0,
  phone text,
  email text,
  kakao_id text,
  arrival_date date,
  arrival_time text,
  arrival_flight text,
  departure_date date,
  departure_time text,
  departure_flight text,
  room_type text,
  room_no text,
  programs text[] default '{}',      -- golf | train | garden | coors ...
  waiver_status text,
  fee_amount text,
  event_fee text,
  payment_received boolean default false,
  payment_checked_by text,
  payment_checked_at timestamptz,
  payment_method text,
  checked_in boolean default false,
  checked_in_by text,
  checked_in_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 2) 방 배정
-- -------------------------------------------------------------
create table if not exists public.mou_rooms (
  id uuid primary key default gen_random_uuid(),
  room_no text,
  room_type text,                    -- 1인실 | 2인실
  capacity int default 2,
  occupant_ids uuid[] default '{}',
  check_in date,
  check_out date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 3) 공항 픽업/드랍 (9인승 밴)
-- -------------------------------------------------------------
create table if not exists public.mou_transport_trips (
  id uuid primary key default gen_random_uuid(),
  trip_type text,                    -- pickup_in (입국 픽업) | dropoff_out (출국 드랍)
  trip_date date,
  trip_time text,
  vehicle_label text,
  capacity int default 9,
  driver text,
  passenger_ids uuid[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 4) 기차(Pikes Peak) 차량/인솔
-- -------------------------------------------------------------
create table if not exists public.mou_train_groups (
  id uuid primary key default gen_random_uuid(),
  vehicle_label text,                -- VAN1 | VAN2 | SUV ...
  driver text,                       -- 운전자
  leader text,                       -- 인솔자
  volunteer text,                    -- 봉사자
  role text,                         -- (구) 단일 역할 — 미사용
  capacity int default 9,
  passenger_ids uuid[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 5) 골프 팀
-- -------------------------------------------------------------
create table if not exists public.mou_golf_teams (
  id uuid primary key default gen_random_uuid(),
  team_no int,
  team_name text,
  tee_info text,
  member_ids uuid[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 6) 업무 지시
-- -------------------------------------------------------------
create table if not exists public.mou_tasks (
  id uuid primary key default gen_random_uuid(),
  day text,
  category text,
  task text,
  responsible text[] default '{}',
  due_date date,
  status text default 'Not Started', -- Not Started | In Progress | Completed
  supplies text,
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 7) 일정표
-- -------------------------------------------------------------
create table if not exists public.mou_schedule (
  id uuid primary key default gen_random_uuid(),
  day text,
  time_start text,
  time_end text,
  title text,
  detail text,
  responsible text,
  note text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 8) 운영 인력 명단 (업무 담당자 후보) — 봉사자 / 준비위원회 / 덴버회원
-- -------------------------------------------------------------
create table if not exists public.mou_staff (
  id uuid primary key default gen_random_uuid(),
  name text,
  role_group text,                   -- 봉사자 | 준비위원회 | 덴버회원
  title text,                        -- 직책/지회
  phone text,
  email text,
  kakao_id text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================
-- RLS: 모든 mou_* 테이블은 관리자만 읽기/쓰기 가능 (PII 보호)
-- =============================================================
do $$
declare
  t text;
  tables text[] := array[
    'mou_participants','mou_rooms','mou_transport_trips',
    'mou_train_groups','mou_golf_teams','mou_tasks','mou_schedule','mou_staff'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists %I on public.%I;', t || '_admin_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.mou_is_admin()) with check (public.mou_is_admin());',
      t || '_admin_all', t
    );
  end loop;
end $$;
