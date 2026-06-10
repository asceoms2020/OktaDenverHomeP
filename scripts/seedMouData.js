/* eslint-disable no-console */
/**
 * MOU 이벤트 — CSV → Supabase 시드 SQL 생성기
 *
 * 사용법:  node scripts/seedMouData.js
 *
 * 동작:
 *   1) "참가자 명단" CSV를 마스터로 파싱 (참가자마다 고정 UUID 부여)
 *   2) "checkin-out" 으로 결제/항공 보강
 *   3) "Room list" CSV로 방(mou_rooms) 자동 생성 + 입실자를 참가자 UUID로 연결
 *   → supabase/mou_seed.sql 생성 (mou_participants + mou_rooms)
 *
 * Supabase SQL Editor 실행 순서:
 *   1) supabase/mou_schema.sql   (테이블 생성, 1회)
 *   2) supabase/mou_seed.sql     (데이터 시드 — 재실행 시 참가자/방 초기화됨)
 *
 * 주의: CSV 이름표기가 제각각이라 일부는 매칭이 안 될 수 있습니다.
 *       방의 미매칭 입실자는 room.notes 에 "미매칭: 이름" 으로 남기니
 *       시드 후 "방 배정" 화면에서 직접 보정하세요.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR = path.join(__dirname, '..', 'src', 'assets', 'mouevent');
const OUT = path.join(__dirname, '..', 'supabase', 'mou_seed.sql');
const YEAR = 2026;

// ---------- 최소 RFC4180 CSV 파서 ----------
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// ---------- 헬퍼 ----------
const clean = (s) => (s == null ? '' : String(s).trim());
const uuid = () => crypto.randomUUID();
const normEn = (s) => clean(s).toLowerCase().replace(/[\s.,]/g, '');

function splitName(raw) {
  const s = clean(raw);
  if (!s) return { ko: '', en: '' };
  const parts = s.split('/').map((p) => p.trim());
  if (parts.length >= 2) {
    const ko = parts.find((p) => /[가-힣]/.test(p)) || parts[0];
    const en = parts.find((p) => p !== ko && /[A-Za-z]/.test(p)) || '';
    return { ko, en };
  }
  if (/[가-힣]/.test(s)) return { ko: s, en: '' };
  return { ko: '', en: s };
}

function parseDate(raw) {
  const s = clean(raw);
  if (!s) return null;
  const m = s.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (!m) return null;
  const month = String(m[1]).padStart(2, '0');
  const day = String(m[2]).padStart(2, '0');
  let year = m[3] ? parseInt(m[3], 10) : YEAR;
  if (year < 100) year += 2000;
  return `${year}-${month}-${day}`;
}

function parseDateRange(raw) {
  const s = clean(raw);
  const all = s.match(/\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/g) || [];
  return { check_in: parseDate(all[0]), check_out: parseDate(all[1]) };
}

// "1:20PM" → "13:20" 24시간제로 정규화
function to24(h, m, ap) {
  h = parseInt(h, 10);
  const a = (ap || '').toLowerCase().replace(/[.\s]/g, '');
  if (a.startsWith('p') && h < 12) h += 12;
  if (a.startsWith('a') && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

function parseSegment(text) {
  const t = text.match(/(\d{1,2}):(\d{2})\s*([apAP]\.?\s?[mM]\.?)?/);
  const f = text.match(/\b([A-Za-z]{2})\s?(\d{2,4})\b/);
  return {
    time: t ? to24(t[1], t[2], t[3]) : '',
    flight: f ? `${f[1].toUpperCase()}${f[2]}` : '',
  };
}

/**
 * 비고의 항공 정보 파싱.
 *  예) "6/24 UA2455 12:16PM, 6/28 UA1715 3:35PM"
 *      "AC4902 6/25 12:30PM 6/27 AC1038 18:10"
 *  → 첫 날짜 구간 = 입국, 두번째 날짜 구간 = 출국
 */
function parseFlights(note) {
  const s = clean(note);
  if (!s) return {};
  const dates = [...s.matchAll(/(\d{1,2})\/(\d{1,2})/g)];
  if (dates.length === 0) {
    const seg = parseSegment(s);
    return { arrival_time: seg.time, arrival_flight: seg.flight };
  }
  const secondIdx = dates[1] ? dates[1].index : s.length;
  const arr = parseSegment(s.slice(0, secondIdx));
  const dep = dates[1] ? parseSegment(s.slice(secondIdx)) : {};
  return {
    arrival_date: parseDate(`${dates[0][1]}/${dates[0][2]}`),
    arrival_time: arr.time || '',
    arrival_flight: arr.flight || '',
    departure_date: dates[1] ? parseDate(`${dates[1][1]}/${dates[1][2]}`) : null,
    departure_time: dep.time || '',
    departure_flight: dep.flight || '',
  };
}

function parsePrograms(raw) {
  const s = clean(raw).toLowerCase();
  const out = [];
  if (/golf|골프/.test(s)) out.push('golf');
  if (/pikes|기차|train|cog/.test(s)) out.push('train');
  if (/garden/.test(s)) out.push('garden');
  if (/coors/.test(s)) out.push('coors');
  if (/broadmoor|springs/.test(s)) out.push('springs');
  return out;
}

function memberType(position) {
  const p = clean(position);
  if (/차세대/.test(p)) return '차세대';
  if (/봉사/.test(p)) return '차세대봉사자';
  if (/동반자/.test(p)) return '동반자';
  if (/덴버/.test(p)) return '덴버';
  return '정회원';
}

// ---------- SQL 직렬화 ----------
const sqlStr = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const sqlBool = (v) => (v ? 'true' : 'false');
const sqlTextArr = (arr) =>
  !arr || arr.length === 0 ? "'{}'" : `'{${arr.map((x) => `"${String(x).replace(/"/g, '\\"')}"`).join(',')}}'`;
const sqlUuidArr = (arr) => (!arr || arr.length === 0 ? "'{}'" : `'{${arr.join(',')}}'`);

// ---------- checkin-out 보강 ----------
function buildFlightMap() {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - checkin-out.csv');
  const map = {};
  if (!fs.existsSync(file)) return map;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const name = splitName(r[0]).ko || clean(r[0]);
    if (!name) continue;
    const note = clean(r[10]);
    map[name] = { payment_paid: /납부완료|완료/.test(clean(r[9])), flight_note: note, ...parseFlights(note) };
  }
  return map;
}

// ---------- 참가자 파싱 ----------
function buildParticipants() {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - 참가자 명단.csv');
  if (!fs.existsSync(file)) { console.error('참가자 명단 CSV 없음'); process.exit(1); }
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const flightMap = buildFlightMap();
  const records = [];
  const koMap = {}, enMap = {};

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!clean(r[0])) continue;
    const { ko, en } = splitName(r[0]);
    const position = clean(r[2]);
    const flight = flightMap[ko] || {};
    const id = uuid();
    const hasComp = /yes|y|예|있음/i.test(clean(r[3]));
    // 항공 시간: checkin-out 비고 우선, 없으면 참가자 명단 비고(r[18])에서 파싱
    const noteFlights = parseFlights(clean(r[18]));
    const rec = {
      id,
      name_ko: ko,
      name_en: en,
      chapter: clean(r[1]),
      position,
      member_type: ko === '이혜연' ? '차세대봉사자' : memberType(position),
      has_companion: hasComp,
      companion_name: clean(r[4]),
      companion_count: hasComp ? 1 : 0,
      phone: '',
      email: '',
      kakao_id: '',
      arrival_date: parseDate(r[6]) || flight.arrival_date || noteFlights.arrival_date || null,
      arrival_time: flight.arrival_time || noteFlights.arrival_time || '',
      departure_date: parseDate(r[7]) || flight.departure_date || noteFlights.departure_date || null,
      departure_time: flight.departure_time || noteFlights.departure_time || '',
      arrival_flight: flight.arrival_flight || noteFlights.arrival_flight || '',
      departure_flight: flight.departure_flight || noteFlights.departure_flight || '',
      room_type: clean(r[8]),
      room_no: clean(r[9]),
      programs: parsePrograms(r[10]),
      waiver_status: clean(r[11]),
      event_fee: clean(r[13]),
      fee_amount: clean(r[8]),
      golf_rental: (() => { const gr = clean(r[12]); return gr !== '' && !/no|x|없/i.test(gr); })(),
      payment_received: /납부완료|완료/.test(clean(r[14])) || !!flight.payment_paid,
      payment_method: clean(r[15]),
      notes: clean(r[18]),
    };
    records.push(rec);
    if (ko) koMap[ko] = id;
    if (en) enMap[normEn(en)] = id;
  }
  return { records, koMap, enMap };
}

// ---------- 차세대 봉사단 파싱 (비상연락망 CSV) ----------
function buildVolunteers(koMap, enMap) {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - 비상연락망.csv');
  const out = [];
  if (!fs.existsSync(file)) return out;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));

  // 헤더( 이름 / 영문 이름 / 지회 / ... ) 위치 탐색
  let start = -1;
  for (let i = 0; i < rows.length; i++) {
    if (clean(rows[i][0]) === '이름' && clean(rows[i][2]) === '지회') { start = i + 1; break; }
  }
  if (start === -1) return out;

  const t5 = (s) => clean(s).slice(0, 5); // "19:30:00" → "19:30"
  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const ko = clean(r[0]);
    if (!ko) break; // 블록 종료 (빈 행)
    const en = clean(r[1]);
    const id = uuid();
    out.push({
      id,
      name_ko: ko,
      name_en: en,
      chapter: clean(r[2]),
      position: '차세대 봉사자',
      member_type: '차세대봉사자',
      has_companion: false,
      companion_name: '',
      companion_count: 0,
      phone: clean(r[3]),
      email: clean(r[4]),
      kakao_id: clean(r[5]),
      arrival_date: parseDate(r[6]) || (clean(r[6]) || null),
      arrival_time: t5(r[7]),
      departure_date: parseDate(r[8]) || (clean(r[8]) || null),
      departure_time: t5(r[9]),
      arrival_flight: '',
      departure_flight: '',
      room_type: '',
      room_no: '',
      programs: [],
      waiver_status: '',
      event_fee: '',
      fee_amount: '',
      payment_received: false,
      payment_method: '',
      notes: '차세대 봉사단 (숙박비 제공)',
    });
    if (ko) koMap[ko] = id;
    if (en) enMap[normEn(en)] = id;
  }
  return out;
}

// ---------- Denver 준비위원회 파싱 (비상연락망 CSV) ----------
function buildCommittee(koMap, enMap) {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - 비상연락망.csv');
  const out = [];
  if (!fs.existsSync(file)) return out;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));

  // "Denver 준비위원회" 섹션 헤더 위치 탐색
  let start = -1;
  for (let i = 0; i < rows.length; i++) {
    if (/Denver\s*준비위원회/.test(clean(rows[i][0]))) {
      // 다음 행이 "이름,영문 이름,Position,..." 헤더 → 그 다음부터 데이터
      start = (clean(rows[i + 1][0]) === '이름') ? i + 2 : i + 1;
      break;
    }
  }
  if (start === -1) return out;

  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const ko = clean(r[0]);
    if (!ko) break;            // 블록 종료(빈 행)
    if (ko === '덴버지회 회원') break;
    const en = clean(r[1]);
    const id = uuid();
    out.push({
      id,
      name_ko: ko,
      name_en: en,
      chapter: 'Denver',
      position: clean(r[2]),
      member_type: '준비위원회',
      has_companion: false,
      companion_name: '',
      companion_count: 0,
      phone: clean(r[3]),
      email: clean(r[4]),
      kakao_id: '',
      arrival_date: null,
      arrival_time: '',
      departure_date: null,
      departure_time: '',
      arrival_flight: '',
      departure_flight: '',
      room_type: '',
      room_no: '',
      programs: [],
      waiver_status: '',
      event_fee: '',
      fee_amount: '',
      payment_received: false,
      payment_method: '',
      notes: 'Denver 준비위원회',
    });
    if (ko) koMap[ko] = id;
    if (en) enMap[normEn(en)] = id;
  }
  return out;
}

// ---------- 덴버지회 회원 파싱 (비상연락망 CSV) ----------
function buildDenver(koMap, enMap) {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - 비상연락망.csv');
  const out = [];
  if (!fs.existsSync(file)) return out;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));

  let start = -1;
  for (let i = 0; i < rows.length; i++) {
    if (clean(rows[i][0]) === '덴버지회 회원') { start = i + 1; break; }
  }
  if (start === -1) return out;

  for (let i = start; i < rows.length; i++) {
    const c0 = clean(rows[i][0]);
    if (!c0) break;
    const m = c0.match(/\+\s*(\d+)\s*$/);
    const cc = m ? parseInt(m[1], 10) : 0;
    const name = c0.replace(/\s*\+\s*\d+\s*$/, '').trim();
    if (!name) continue;
    const id = uuid();
    out.push({
      id,
      name_ko: name,
      name_en: '',
      chapter: 'Denver',
      position: '덴버지회 회원',
      member_type: '덴버지회',
      has_companion: cc > 0,
      companion_name: '',
      companion_count: cc,
      phone: '', email: '', kakao_id: '',
      arrival_date: null, arrival_time: '',
      departure_date: null, departure_time: '',
      arrival_flight: '', departure_flight: '',
      room_type: '', room_no: '',
      programs: [], waiver_status: '',
      event_fee: '', fee_amount: '',
      payment_received: false, payment_method: '',
      notes: '덴버지회 회원',
    });
    if (name) koMap[name] = id;
  }
  return out;
}

// ---------- Room list 파싱 → 방 + 입실자 연결 ----------
function buildRooms(koMap, enMap) {
  const file = path.join(DIR, '비지니스 포럼 준비 상황 - Room list.csv');
  const rooms = [];
  if (!fs.existsSync(file)) return rooms;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));

  const matchId = (raw) => {
    const { ko, en } = splitName(raw);
    if (ko && koMap[ko]) return koMap[ko];
    if (en && enMap[normEn(en)]) return enMap[normEn(en)];
    return null;
  };
  const assigned = new Set(); // 한 사람이 여러 방에 들어가는 중복 방지
  const pushOcc = (room, raw) => {
    const id = matchId(raw);
    const nm = clean(raw);
    if (!nm) return;
    if (id) {
      if (assigned.has(id)) return; // 이미 다른 방에 배정됨 → 중복 스킵
      assigned.add(id);
      room.occupant_ids.push(id);
    } else room.unmatched.push(splitName(raw).ko || nm);
  };

  let cur2 = null; // 현재 2인실 (두번째 입실자 이어붙이기용)
  // 데이터는 행 3부터 시작 (헤더 2줄). 안전하게 숫자/이름 패턴으로 판별.
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    const idx2 = clean(r[0]);   // 2인실 방 인덱스
    const name2 = clean(r[2]);  // 2인실 입실자
    const date2 = clean(r[3]);
    const idx1 = clean(r[4]);   // 1인실 방 인덱스
    const name1 = clean(r[6]);  // 1인실 입실자
    const date1 = clean(r[7]);

    // 2인실
    if (/^\d+$/.test(idx2)) {
      cur2 = {
        id: uuid(), room_no: `2인-${idx2}`, room_type: '2인실', capacity: 2,
        occupant_ids: [], unmatched: [], ...parseDateRange(date2),
      };
      rooms.push(cur2);
      if (name2) pushOcc(cur2, name2);
    } else if (name2 && cur2) {
      pushOcc(cur2, name2);
      if (!cur2.check_in) Object.assign(cur2, parseDateRange(date2));
    }

    // 1인실
    if (/^\d+$/.test(idx1) && name1) {
      const room = {
        id: uuid(), room_no: `1인-${idx1}`, room_type: '1인실', capacity: 1,
        occupant_ids: [], unmatched: [], ...parseDateRange(date1),
      };
      pushOcc(room, name1);
      rooms.push(room);
    }
  }
  return rooms;
}

// ---------- 메인 ----------
function main() {
  const { records, koMap, enMap } = buildParticipants();
  const volunteers = buildVolunteers(koMap, enMap); // koMap/enMap 확장 (방 매칭에 활용)
  const committee = buildCommittee(koMap, enMap);    // Denver 준비위원회 → 참가자
  const denver = buildDenver(koMap, enMap);          // 덴버지회 회원 → 참가자
  const all = records.concat(volunteers, committee, denver);
  const rooms = buildRooms(koMap, enMap);

  let sql = '-- MOU 시드 (자동 생성) — supabase/mou_seed.sql\n';
  sql += '-- 먼저 mou_schema.sql 실행 후 이 파일을 실행하세요. (재실행 시 참가자/방 초기화)\n';
  sql += 'begin;\n';
  sql += 'truncate table public.mou_participants cascade;\n';
  sql += 'truncate table public.mou_rooms cascade;\n\n';

  // 참가자 (정회원/동반자 + 차세대 봉사단)
  for (const r of all) {
    sql +=
      'insert into public.mou_participants ' +
      '(id,name_ko,name_en,chapter,position,member_type,has_companion,companion_name,companion_count,' +
      'phone,email,kakao_id,arrival_date,arrival_time,arrival_flight,departure_date,departure_time,departure_flight,' +
      'room_type,room_no,programs,waiver_status,event_fee,fee_amount,golf_rental,payment_received,payment_method,notes) values (' +
      [
        sqlStr(r.id), sqlStr(r.name_ko), sqlStr(r.name_en), sqlStr(r.chapter), sqlStr(r.position),
        sqlStr(r.member_type), sqlBool(r.has_companion), sqlStr(r.companion_name), (r.companion_count || 0),
        sqlStr(r.phone), sqlStr(r.email), sqlStr(r.kakao_id),
        r.arrival_date ? sqlStr(r.arrival_date) : 'NULL', sqlStr(r.arrival_time), sqlStr(r.arrival_flight),
        r.departure_date ? sqlStr(r.departure_date) : 'NULL', sqlStr(r.departure_time), sqlStr(r.departure_flight),
        sqlStr(r.room_type), sqlStr(r.room_no), sqlTextArr(r.programs),
        sqlStr(r.waiver_status), sqlStr(r.event_fee), sqlStr(r.fee_amount), sqlBool(r.golf_rental),
        sqlBool(r.payment_received), sqlStr(r.payment_method), sqlStr(r.notes),
      ].join(',') + ');\n';
  }

  sql += '\n';

  // 방
  let matchedOcc = 0, unmatchedOcc = 0;
  for (const rm of rooms) {
    matchedOcc += rm.occupant_ids.length;
    unmatchedOcc += rm.unmatched.length;
    // 2인실에 1명만 매칭됐는데 미매칭 이름이 있으면 그건 동반자. 그 외 미매칭은 표시 안 함.
    let note = '';
    if (rm.unmatched.length && rm.room_type === '2인실' && rm.occupant_ids.length === 1) {
      note = `동반자: ${rm.unmatched.join(', ')}`;
    }
    sql +=
      'insert into public.mou_rooms (id,room_no,room_type,capacity,occupant_ids,check_in,check_out,notes) values (' +
      [
        sqlStr(rm.id), sqlStr(rm.room_no), sqlStr(rm.room_type), rm.capacity,
        sqlUuidArr(rm.occupant_ids),
        rm.check_in ? sqlStr(rm.check_in) : 'NULL',
        rm.check_out ? sqlStr(rm.check_out) : 'NULL',
        sqlStr(note),
      ].join(',') + ');\n';
  }

  sql += '\ncommit;\n';
  fs.writeFileSync(OUT, sql, 'utf8');
  console.log(`완료: 참가자 ${all.length}명 (명단 ${records.length} + 봉사단 ${volunteers.length} + 준비위 ${committee.length} + 덴버지회 ${denver.length}), 방 ${rooms.length}개 (입실 매칭 ${matchedOcc}명 / 미매칭 ${unmatchedOcc}명)`);
  console.log(`→ ${OUT}`);
}

main();
