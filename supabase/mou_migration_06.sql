-- =============================================================
-- MOU 마이그레이션 06 — 공항 교통 차량에 인솔자/봉사자 칸 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- =============================================================
alter table public.mou_transport_trips
  add column if not exists leader text,     -- 인솔자
  add column if not exists volunteer text;  -- 봉사자
