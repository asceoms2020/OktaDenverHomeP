-- =============================================================
-- MOU 마이그레이션 01 — 체크인 + 동반자 인원수 컬럼 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- (신규 설치는 최신 mou_schema.sql 에 이미 포함되어 있어 불필요)
-- =============================================================
alter table public.mou_participants
  add column if not exists checked_in boolean default false,
  add column if not exists checked_in_by text,
  add column if not exists checked_in_at timestamptz,
  add column if not exists companion_count int default 0;

-- 기존 데이터 보정: 동반자 있는 행은 동반 인원 1명으로 설정
update public.mou_participants
  set companion_count = 1
  where has_companion = true and coalesce(companion_count, 0) = 0;
