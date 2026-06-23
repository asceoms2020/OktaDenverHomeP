-- =============================================================
-- 교류회 추천 장소 (event_places) — 공개 읽기 / 관리자만 추가·수정·삭제
-- Supabase SQL Editor 에서 1회 실행. (mou_is_admin() 함수가 이미 있어야 함 — mou_schema.sql)
-- =============================================================
create table if not exists public.event_places (
  id uuid primary key default gen_random_uuid(),
  category text default 'Pub',     -- Pub | Restaurant | 기타
  name text not null,
  address text,
  url text,                        -- 직접 링크(있으면 우선). 없으면 이름+주소로 구글맵 검색
  region text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.event_places enable row level security;

-- 읽기: 누구나(비로그인 포함)
drop policy if exists event_places_read on public.event_places;
create policy event_places_read on public.event_places for select using (true);

-- 쓰기: 관리자만
drop policy if exists event_places_admin_write on public.event_places;
create policy event_places_admin_write on public.event_places
  for all to authenticated
  using (public.mou_is_admin()) with check (public.mou_is_admin());

-- 초기 데이터 (있으면 건너뜀)
insert into public.event_places (category, name, address, sort_order)
select v.category, v.name, v.address, v.so
from (values
  ('Pub', 'Angelo''s Taverna - Littleton', 'Angelo''s Taverna, Littleton, CO', 1),
  ('Pub', 'Postino', '830 Colorado Blvd, Denver, CO 80206', 2),
  ('Pub', 'Family', '2760 S Havana St Unit R-S, Aurora, CO 80014', 3),
  ('Pub', 'Funny Plus', '2779 S Parker Rd, Aurora, CO 80014', 4),
  ('Pub', '땡술', '2222 S Havana St E, Aurora, CO 80014', 5),
  ('Pub', '54thirty Rooftop', '1475 California St, Denver, CO 80202', 6),
  ('Pub', 'Prost Brewing Company', 'Prost Brewing Company, Denver, CO', 7),
  ('Restaurant', 'Seoul BBQ', '2080 S Havana St, Aurora, CO 80014', 8),
  ('Restaurant', 'Tofu House (소공동)', '2353 S Havana St # D1, Aurora, CO 80014', 9),
  ('Restaurant', 'Yong Gung', '2040 S Havana St, Aurora, CO 80014', 10),
  ('Restaurant', 'Paik''s noodle (홍콩반점)', '12101 E Iliff Ave Ste K, Aurora, CO 80014', 11),
  ('Restaurant', 'ViewHouse', '7101 S Clinton St, Centennial, CO 80112', 12)
) as v(category, name, address, so)
where not exists (select 1 from public.event_places p where p.name = v.name);
