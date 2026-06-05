-- =============================================================
-- MOU 방 메모(notes) 정리
--   1) 2인실 + 입실 1명 + "미매칭: X" → "동반자: X" (X는 동반자임)
--   2) 그 외 남은 "미매칭..." 메모는 모두 삭제
-- Supabase SQL Editor 에서 1회 실행. 입실 배정은 건드리지 않음.
-- =============================================================
begin;

-- 1) 2인실에 1명만 매칭된 경우, 미매칭 이름은 동반자 → "동반자:" 로 변경
update public.mou_rooms
set notes = replace(notes, '미매칭:', '동반자:'),
    updated_at = now()
where room_type = '2인실'
  and array_length(occupant_ids, 1) = 1
  and notes like '미매칭:%';

-- 2) 나머지 미매칭 메모는 모두 제거
update public.mou_rooms
set notes = null,
    updated_at = now()
where notes like '%미매칭%';

commit;
