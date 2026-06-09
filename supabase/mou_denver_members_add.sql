-- =============================================================
-- MOU 덴버지회 회원 추가 — 비상연락망의 "덴버지회 회원" 11명을 참가자로 추가
-- 구분(member_type)='덴버지회', 요금/프로그램 없음(인원만 추가). "+1"은 동반 1명.
-- Supabase SQL Editor 에서 1회 실행. 재실행해도 안전(중복 방지).
-- =============================================================
begin;

insert into public.mou_participants (name_ko, member_type, companion_count, has_companion, programs)
select v.name_ko, '덴버지회', v.cc, (v.cc > 0), '{}'::text[]
from (values
  ('정미경', 0),
  ('김민영', 0),
  ('박해찬', 0),
  ('신동윤', 1),
  ('최윤성', 0),
  ('이승우', 1),
  ('신윤주', 0),
  ('써니(소공동)', 1),
  ('오승록', 0),
  ('네이슨 갈스터', 0),
  ('신범식', 1)
) as v(name_ko, cc)
where not exists (
  select 1 from public.mou_participants p
  where p.member_type = '덴버지회' and p.name_ko = v.name_ko
);

commit;
