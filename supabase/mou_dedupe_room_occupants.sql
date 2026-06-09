-- =============================================================
-- MOU 방 입실 중복 정리 — 한 사람이 여러 방에 들어가 있으면
-- 가장 먼저 만들어진 방만 남기고 나머지 방에서 제거 (1인 1방)
-- Supabase SQL Editor 에서 1회 실행.
-- =============================================================
begin;

with occ as (
  select r.id as room_id, r.created_at, unnest(r.occupant_ids) as pid
  from public.mou_rooms r
),
ranked as (
  select room_id, pid,
    row_number() over (partition by pid order by created_at, room_id) as rn
  from occ
),
toremove as (
  select room_id, array_agg(pid) as remove_ids
  from ranked
  where rn > 1
  group by room_id
)
update public.mou_rooms m
set occupant_ids = coalesce((
      select array_agg(x)
      from unnest(m.occupant_ids) x
      where not (x = any (tr.remove_ids))
    ), '{}'::uuid[]),
    updated_at = now()
from toremove tr
where m.id = tr.room_id;

commit;
