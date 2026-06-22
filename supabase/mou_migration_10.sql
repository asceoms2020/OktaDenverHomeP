-- =============================================================
-- MOU 마이그레이션 10 — 골프 팀에 기타(외부) 골퍼 직접입력 컬럼 추가
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- =============================================================
alter table public.mou_golf_teams
  add column if not exists extra_members text[] default '{}';
