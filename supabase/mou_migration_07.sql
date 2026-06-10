-- =============================================================
-- MOU 마이그레이션 07 — 골프 클럽 렌탈 여부 컬럼 추가 (+$65)
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- =============================================================
alter table public.mou_participants
  add column if not exists golf_rental boolean default false;
