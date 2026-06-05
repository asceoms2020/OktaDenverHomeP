-- =============================================================
-- MOU 마이그레이션 03 — 기차팀 차량에 인솔자/봉사자 칸 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- (신규 설치는 최신 mou_schema.sql 에 포함되어 불필요)
-- =============================================================
alter table public.mou_train_groups
  add column if not exists leader text,     -- 인솔자
  add column if not exists volunteer text;  -- 봉사자
