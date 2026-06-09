-- =============================================================
-- MOU 방번호 연속 재정렬 — 타입별(1인-N / 2인-N)로 빈 번호를 없애고
-- 현재 번호 순서대로 1,2,3,... 로 다시 매김. (예: 2인-11,2인-13 → 2인-11,2인-12)
-- Supabase SQL Editor 에서 1회 실행. 입실 배정은 유지됨.
-- =============================================================
begin;

with seq as (
  select id,
    (case when room_no ~ '^1인-' then '1인' else '2인' end) as prefix,
    row_number() over (
      partition by (case when room_no ~ '^1인-' then '1인' else '2인' end)
      order by (split_part(room_no, '-', 2))::int
    ) as rn
  from public.mou_rooms
  where room_no ~ '^[12]인-[0-9]+$'
)
update public.mou_rooms m
set room_no = seq.prefix || '-' || seq.rn,
    updated_at = now()
from seq
where m.id = seq.id
  and m.room_no <> (seq.prefix || '-' || seq.rn);

commit;
