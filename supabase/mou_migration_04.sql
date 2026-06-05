-- =============================================================
-- MOU 마이그레이션 04 — 숙박 추가요금 납부 컬럼 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- (신규 설치는 최신 mou_schema.sql 에 포함되어 불필요)
-- =============================================================
alter table public.mou_participants
  add column if not exists lodging_paid boolean default false,
  add column if not exists lodging_paid_by text,
  add column if not exists lodging_paid_at timestamptz;
