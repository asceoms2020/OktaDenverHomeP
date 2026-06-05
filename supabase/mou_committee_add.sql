-- =============================================================
-- MOU 데이터 보정 — 이혜연을 차세대봉사자로 + Denver 준비위원회를 참가자로 추가
-- Supabase SQL Editor 에서 1회 실행. (기존 데이터/배정은 건드리지 않는 추가·수정 방식)
-- 재실행해도 안전(중복 삽입 방지).
-- =============================================================
begin;

-- 1) 이혜연 / Alice Lee → 차세대봉사자 (숙박비 면제 그룹)
update public.mou_participants
  set member_type = '차세대봉사자', updated_at = now()
  where name_ko = '이혜연' or name_en ilike 'Alice Lee';

-- 2) Denver 준비위원회 7명 → 참가자로 추가 (방배정/골프/기차 배정 가능하게)
insert into public.mou_participants (name_ko, name_en, member_type, position, phone, email, programs)
select v.name_ko, v.name_en, '준비위원회', v.title, v.phone, v.email, '{}'::text[]
from (values
  ('최준경','June Choi','지회장', null, 'jkccolorado@gmail.com'),
  ('박수정','Soo Park','부회장', '3035649327', 'soojunghpark@gmail.com'),
  ('박수영','Suyoung Park','기획 위원장', null, 'sylike20@gmail.com'),
  ('김경숙','Suki Kim','홍보 위원장', null, 'sukigalster@gmail.com'),
  ('윤정민', null, '총무', null, 'contact@oktadenver.org'),
  ('정민수', null, '차세대 위원장', '840-231-9187', null),
  ('최제민', null, '차세대 대표', null, null)
) as v(name_ko, name_en, title, phone, email)
where not exists (
  select 1 from public.mou_participants p
  where p.member_type = '준비위원회' and p.name_ko = v.name_ko
);

commit;
