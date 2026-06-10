-- =============================================================
-- MOU 마이그레이션 05 — 차량 그룹에 활동(activity) 구분 추가
-- (기차 / Garden of Gods / Coors 차량 배정을 한 테이블에서 관리)
-- 이미 mou_schema.sql 을 실행한 DB에서 1회 실행하세요.
-- =============================================================
alter table public.mou_train_groups
  add column if not exists activity text default 'train';

-- 기존 차량은 모두 기차(train)로 간주
update public.mou_train_groups set activity = 'train' where activity is null;
