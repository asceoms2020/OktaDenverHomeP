-- MOU 운영 인력 명단 시드 (비상연락망.csv 자동 생성) — supabase/mou_staff_seed.sql
-- mou_staff 테이블만 초기화합니다. (기존 DB면 먼저 mou_migration_02.sql 실행)
begin;
truncate table public.mou_staff;

insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('김민지','봉사자','Vancouver','1 778 956 4229','hiji3kimminjee@gmail.com','mj960203',0);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('송준영','봉사자','Vancouver','1 672 971 0944','trtr305@gmail.com','Trtr305',1);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('변재준','봉사자','Los Angeles','1 626 437 6336','jaejunb@gmail.com','jaejunb',2);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('한누리','봉사자','Houston','832 705 0366','nathanielhan0111@gmail.com','attinate',3);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('이지창','봉사자','Denver','82 1053985621','nbmc.jilee@gmail.com',NULL,4);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('장은영','봉사자','Vancouver','1 604 813 0836','crystalj.realty@gmail.com','crystaljang2',5);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('이지현','봉사자','Vancouver','1 778 320 6769','ablewellnesscentre@gmail.com','Alicia930304',6);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('리나','봉사자','Los Angeles','323 767 6205','nana.li.okta@gmail.com','nanali27',7);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('이홍준','봉사자','Los Angeles','424 903 5021','lhjn2001@gmail.com','Jun424',8);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('김현우','봉사자','Seattle',NULL,NULL,NULL,9);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('최준경','준비위원회','지회장',NULL,'jkccolorado@gmail.com',NULL,10);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('박수정','준비위원회','부회장','3035649327','soojunghpark@gmail.com',NULL,11);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('박수영','준비위원회','기획 위원장',NULL,'sylike20@gmail.com',NULL,12);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('김경숙','준비위원회','홍보 위원장',NULL,'sukigalster@gmail.com',NULL,13);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('윤정민','준비위원회','총무',NULL,'contact@oktadenver.org',NULL,14);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('정민수','준비위원회','차세대 위원장','840-231-9187',NULL,NULL,15);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('최제민','준비위원회','차세대 대표',NULL,NULL,NULL,16);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('정미경','덴버회원',NULL,NULL,NULL,NULL,17);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('김민영','덴버회원',NULL,NULL,NULL,NULL,18);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('박해찬','덴버회원',NULL,NULL,NULL,NULL,19);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('신동윤','덴버회원',NULL,NULL,NULL,NULL,20);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('최윤성','덴버회원',NULL,NULL,NULL,NULL,21);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('이승우','덴버회원',NULL,NULL,NULL,NULL,22);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('신윤주','덴버회원',NULL,NULL,NULL,NULL,23);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('써니(소공동)','덴버회원',NULL,NULL,NULL,NULL,24);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('오승록','덴버회원',NULL,NULL,NULL,NULL,25);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('네이슨 갈스터','덴버회원',NULL,NULL,NULL,NULL,26);
insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values ('신범식','덴버회원',NULL,NULL,NULL,NULL,27);

commit;
