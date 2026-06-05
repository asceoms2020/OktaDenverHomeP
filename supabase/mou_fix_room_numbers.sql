-- =============================================================
-- MOU 방번호 정리 — 규칙(1인-N / 2인-N) 안 맞는 방(R-* 등)을 타입별 다음 번호로 변경
-- Supabase SQL Editor 에서 1회 실행. 기존 입실 배정(occupant_ids)은 유지됩니다.
-- =============================================================
begin;

with maxnum as (
  select
    coalesce(max(case when room_type = '1인실' then (split_part(room_no, '-', 2))::int end), 0) as max1,
    coalesce(max(case when room_type = '2인실' then (split_part(room_no, '-', 2))::int end), 0) as max2
  from public.mou_rooms
  where room_no ~ '^[12]인-[0-9]+$'        -- 규칙에 맞는 기존 방만 집계
),
torename as (
  select id, room_type,
    row_number() over (partition by room_type order by created_at, id) as rn
  from public.mou_rooms
  where room_no !~ '^[12]인-[0-9]+$'        -- R-* 등 규칙 안 맞는 방
)
update public.mou_rooms m
set room_no = case
                when t.room_type = '1인실' then '1인-' || (mx.max1 + t.rn)
                else '2인-' || (mx.max2 + t.rn)
              end,
    updated_at = now()
from torename t, maxnum mx
where m.id = t.id;

commit;
