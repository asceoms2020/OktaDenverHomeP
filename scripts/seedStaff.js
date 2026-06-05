/* eslint-disable no-console */
/**
 * MOU 이벤트 — 비상연락망.csv → mou_staff 시드 SQL 생성기
 *
 * 사용법:  node scripts/seedStaff.js
 *
 * 동작:
 *   비상연락망 CSV의 3개 블록(차세대 봉사자 / Denver 준비위원회 / 덴버지회 회원)을
 *   파싱해 업무 담당자 후보 명단(mou_staff)을 supabase/mou_staff_seed.sql 로 생성.
 *
 * Supabase SQL Editor 에서:
 *   1) (기존 DB면) mou_migration_02.sql 로 mou_staff 테이블 생성
 *   2) mou_staff_seed.sql 실행 (재실행 시 mou_staff만 초기화)
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'assets', 'mouevent', '비지니스 포럼 준비 상황 - 비상연락망.csv');
const OUT = path.join(__dirname, '..', 'supabase', 'mou_staff_seed.sql');

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

const clean = (s) => (s == null ? '' : String(s).trim());
const stripPlus = (s) => clean(s).replace(/\s*\+\s*\d+\s*$/, '').trim(); // "신동윤 +1" → "신동윤"

const sqlStr = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

function main() {
  if (!fs.existsSync(FILE)) { console.error('비상연락망 CSV 없음:', FILE); process.exit(1); }
  const rows = parseCsv(fs.readFileSync(FILE, 'utf8'));

  const records = [];
  let group = null;
  let order = 0;

  for (const r of rows) {
    const c0 = clean(r[0]);
    if (!c0) continue;
    if (c0 === '차세대 봉사자 명단') { group = '봉사자'; continue; }
    if (/Denver\s*준비위원회/.test(c0)) { group = '준비위원회'; continue; }
    if (c0 === '덴버지회 회원') { group = '덴버회원'; continue; }
    if (c0 === '이름') continue; // 헤더 행
    if (!group) continue;

    const name = stripPlus(c0);
    if (!name) continue;
    records.push({
      name,
      role_group: group,
      title: group === '덴버회원' ? '' : clean(r[2]),
      phone: group === '덴버회원' ? '' : clean(r[3]),
      email: group === '덴버회원' ? '' : clean(r[4]),
      kakao_id: group === '봉사자' ? clean(r[5]) : '',
      sort_order: order++,
    });
  }

  let sql = '-- MOU 운영 인력 명단 시드 (비상연락망.csv 자동 생성) — supabase/mou_staff_seed.sql\n';
  sql += '-- mou_staff 테이블만 초기화합니다. (기존 DB면 먼저 mou_migration_02.sql 실행)\n';
  sql += 'begin;\n';
  sql += 'truncate table public.mou_staff;\n\n';

  for (const s of records) {
    sql +=
      'insert into public.mou_staff (name,role_group,title,phone,email,kakao_id,sort_order) values (' +
      [
        sqlStr(s.name), sqlStr(s.role_group), sqlStr(s.title),
        sqlStr(s.phone), sqlStr(s.email), sqlStr(s.kakao_id), s.sort_order,
      ].join(',') + ');\n';
  }

  sql += '\ncommit;\n';
  fs.writeFileSync(OUT, sql, 'utf8');

  const byGroup = {};
  records.forEach((s) => { byGroup[s.role_group] = (byGroup[s.role_group] || 0) + 1; });
  console.log(`완료: 담당자 후보 ${records.length}명 → ${OUT}`);
  console.log('그룹별:', JSON.stringify(byGroup));
}

main();
