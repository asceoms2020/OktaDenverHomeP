-- MOU 업무 지시 시드 (Checklist.csv 자동 생성) — supabase/mou_tasks_seed.sql
-- mou_tasks 테이블만 초기화합니다. Supabase SQL Editor 에서 1회 실행하세요.
begin;
truncate table public.mou_tasks;

insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','호텔 컨텍','{"정민수 차세대 위원장","최제민 차세대 대표"}',NULL,'Not Started','무전기, 야드사인, 입국자 명단','출발, 도착시간 확인',0);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','공항 South팀','{"최제민 차세대 대표","발룬티어 1","정민수 차세대 위원장"}',NULL,'Not Started',NULL,NULL,1);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','공항 West팀','{"발룬티어 3","발룬티어 2","정민수 차세대 위원장"}',NULL,'Not Started',NULL,NULL,2);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','Hotel 입구 안내','{"발룬티어 4"}',NULL,'Not Started',NULL,NULL,3);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','호텔 체크인','{"발룬티어 5","발룬티어 6"}',NULL,'Not Started',NULL,NULL,4);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day1(6/25)','공항 픽업 및 호텔 내 안내','레지스터 (행사등록)','{"김민영 이사","이경화","정미경","박수영 기획위원장","박수정 부회장"}',NULL,'Not Started',NULL,NULL,5);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','사전예약','{"이승우 이사장"}',NULL,'Completed',NULL,NULL,6);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','현장답사','{"최제민 차세대 대표","정민수 차세대 위원장","이승우 이사장"}',NULL,'Not Started',NULL,NULL,7);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','골프 팀 배정','{"최준경 회장","이승우 이사장"}',NULL,'Not Started',NULL,NULL,8);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','차량 및 좌석 배정','{"정민수 차세대 위원장","최제민 차세대 대표","최준경 회장"}',NULL,'Not Started','** 예상 인원: 75명','임원진 차량지원 확인',9);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','행사장 인원배치도','{"정민수 차세대 위원장","이승우 이사장"}',NULL,'Not Started',NULL,NULL,10);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','사전 준비','{"정민수 차세대 위원장","이승우 이사장","최제민 차세대 대표"}',NULL,'Not Started',NULL,'골프백 운반, 네임텍, 카트 준비 (카트에 이름 붙여두기)',11);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','행사(골프) 중 준비','{"정민수 차세대 위원장","이승우 이사장","최준경 회장"}',NULL,'Not Started','운전자 / 정민수, 김경숙, 최제민, 박수영, 오승록','홀인원 배치 인원 확인(4명).',12);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','이벤트 준비 (골프 후)','{"정민수 차세대 위원장","이승우 이사장","최준경 회장"}',NULL,'Not Started',NULL,'이벤트 진행 장소, 시간 확인.(식사 전,후)',13);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','준비물 최종 점검','{"정민수 차세대 위원장","최제민 차세대 대표"}',NULL,'Not Started',NULL,NULL,14);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Arrowhead Gold Club (6/26) - 김경숙, 박수영, 정민수, 최제민, 발룬티어','비상상황 대응 계획 정리','{"이승우 이사장"}',NULL,'Not Started',NULL,NULL,15);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Pike Peak Cog Railway','사전예약 이메일 발송 및 예약 완료','{"박수영 기획위원장","김경숙 홍보위원장"}','2026-05-28','In Progress','운전자 2명 / 윤정민, 박수정','이벤트 2주전 결제 예정.',16);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Pike Peak Cog Railway','현장답사','{"박수영 기획위원장","김경숙 홍보위원장","최준경 회장"}','2026-05-16','Completed','외부인사 15명','높은 고도로 건강이상 우려',17);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Pike Peak Cog Railway','기차 팀 배정','{"박수영 기획위원장","김경숙 홍보위원장","최준경 회장"}',NULL,'Not Started','발룬티어 2명','추가인원 발생(총 35명 예상). 운전자 3명 필요',18);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Pike Peak Cog Railway','차량 및 좌석 배정','{"박수영 기획위원장","김경숙 홍보위원장"}',NULL,'Not Started',NULL,NULL,19);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day2(6/26)','Pike Peak Cog Railway','안내문 및 웨이버 폼 발송','{"윤정민 총무"}','2026-05-24','Completed',NULL,'휴대폰 사용불가로 그룹이동 권유',20);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','사전 답사','{"박수영 기획위원장","김경숙 홍보위원장"}',NULL,'Not Started','운전자 / 윤정민, 정민수,',NULL,21);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','티켓 예약','{"김경숙 홍보위원장","박수영 기획위원장"}',NULL,'Completed',NULL,'예약완료(6/3)',22);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','차량 및 좌석 배정','{"최준경 회장","박수정 부회장"}',NULL,'Not Started',NULL,NULL,23);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','점심 예약','{"윤정민 총무"}',NULL,'Not Started',NULL,NULL,24);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','그룹 배정','{"최준경 회장","박수정 부회장"}',NULL,'Not Started',NULL,NULL,25);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','비상상황 대응 계획 정리','{"최준경 회장"}',NULL,'Not Started',NULL,NULL,26);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('Day4(6/28)','Red Rocks & Coors (6/28)','참석 인원 파악','{"박수정 부회장","최준경 회장"}',NULL,'Not Started',NULL,NULL,27);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('공통','Downtown & Pindustry','사전 답사','{"최준경 회장","정민수 차세대 위원장","최제민 차세대 대표"}','2026-06-05','Not Started',NULL,NULL,28);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('공통','Downtown & Pindustry','차량 및 좌석 배정','{"최준경 회장","윤정민 총무"}',NULL,'Not Started',NULL,NULL,29);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('공통','Downtown & Pindustry','장소 예약','{"윤정민 총무"}',NULL,'Not Started',NULL,NULL,30);
insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values ('공통','Downtown & Pindustry','참석 인원 파악','{"박수정 부회장","정민수 차세대 위원장","최준경 회장"}',NULL,'Not Started',NULL,NULL,31);

commit;
