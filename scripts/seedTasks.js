/* eslint-disable no-console */
/**
 * MOU 이벤트 — Checklist.csv → mou_tasks 시드 SQL 생성기
 *
 * 사용법:  node scripts/seedTasks.js
 *
 * 동작:
 *   "Checklist" CSV의 섹션별(공항/골프/기차/Red Rocks&Coors/지회간 교류회)
 *   업무 목록을 파싱해 supabase/mou_tasks_seed.sql 을 생성.
 *
 * Supabase SQL Editor 에서 mou_tasks_seed.sql 을 1회 실행하세요.
 * (mou_tasks 테이블만 초기화 — 참가자/방 시드와 독립)
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'assets', 'mouevent', '비지니스 포럼 준비 상황 - Checklist.csv');
const OUT = path.join(__dirname, '..', 'supabase', 'mou_tasks_seed.sql');
const YEAR = 2026;

// ---------- 미니 CSV 파서 (seedMouData.js와 동일) ----------
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

// 섹션 헤더 첫 칸 → 일자 라벨 (업무 지시 탭 DAY_OPTIONS와 통일)
function mapDay(label) {
  const s = clean(label);
  if (/day\s*1/i.test(s)) return 'Day1(6/25)';
  if (/day\s*2/i.test(s)) return 'Day2(6/26)';
  if (/day\s*3/i.test(s)) return 'Day3(6/27)';
  if (/day\s*4/i.test(s)) return 'Day4(6/28)';
  return '공통';
}

function normStatus(raw) {
  const s = clean(raw).toLowerCase();
  if (/completed|완료/.test(s)) return 'Completed';
  if (/progress|진행/.test(s)) return 'In Progress';
  return 'Not Started';
}

const arr = (s) => clean(s).split(/[,，]/).map((x) => x.trim()).filter(Boolean);

// ---------- SQL 직렬화 ----------
const sqlStr = (v) => (v == null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const sqlTextArr = (a) =>
  !a || a.length === 0 ? "'{}'" : `'{${a.map((x) => `"${String(x).replace(/"/g, '\\"')}"`).join(',')}}'`;

// 헤더 행 여부: 1번 칸이 'Tasks'
const isHeader = (r) => clean(r[1]).toLowerCase() === 'tasks';

// 헤더 행 → 컬럼 인덱스 맵 (섹션마다 위치가 달라 동적 매핑)
function colMap(header) {
  const idx = { task: 1, resp: 2, due: -1, status: -1, notes: -1, supplies: -1 };
  for (let i = 0; i < header.length; i++) {
    const h = clean(header[i]).toLowerCase();
    if (h === 'tasks') idx.task = i;
    else if (h.includes('person')) idx.resp = i;
    else if (h === 'due date' || h === 'date') { if (idx.due === -1) idx.due = i; }
    else if (h === 'status') idx.status = i;
    else if (h === 'notes') { if (idx.notes === -1) idx.notes = i; }
    else if (h === '준비물') idx.supplies = i;
  }
  return idx;
}

function main() {
  if (!fs.existsSync(FILE)) { console.error('Checklist CSV 없음:', FILE); process.exit(1); }
  const rows = parseCsv(fs.readFileSync(FILE, 'utf8'));

  const records = [];
  let day = '공통';
  let cols = null;
  let category = '';
  let order = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (isHeader(r)) {
      day = mapDay(r[0]);
      cols = colMap(r);
      category = '';
      continue;
    }
    if (!cols) continue; // 헤더 전 행 스킵

    // 활동명(그룹) 상속
    const firstCell = clean(r[0]);
    if (firstCell) category = firstCell;

    const task = clean(r[cols.task]);
    if (!task) continue; // 빈 업무 행 스킵

    // 준비물 + 잉여 컬럼(운전자 등) 합치기
    const extras = [];
    if (cols.supplies >= 0 && clean(r[cols.supplies])) extras.push(clean(r[cols.supplies]));
    for (let c = Math.max(cols.supplies, cols.notes, cols.status, cols.due, cols.resp) + 1; c < r.length; c++) {
      const v = clean(r[c]);
      if (v) extras.push(v);
    }

    records.push({
      day,
      category,
      task,
      responsible: cols.resp >= 0 ? arr(r[cols.resp]) : [],
      due_date: cols.due >= 0 ? parseDate(r[cols.due]) : null,
      status: cols.status >= 0 ? normStatus(r[cols.status]) : 'Not Started',
      supplies: extras.join(' / '),
      notes: cols.notes >= 0 ? clean(r[cols.notes]) : '',
      sort_order: order++,
    });
  }

  let sql = '-- MOU 업무 지시 시드 (Checklist.csv 자동 생성) — supabase/mou_tasks_seed.sql\n';
  sql += '-- mou_tasks 테이블만 초기화합니다. Supabase SQL Editor 에서 1회 실행하세요.\n';
  sql += 'begin;\n';
  sql += 'truncate table public.mou_tasks;\n\n';

  for (const t of records) {
    sql +=
      'insert into public.mou_tasks (day,category,task,responsible,due_date,status,supplies,notes,sort_order) values (' +
      [
        sqlStr(t.day), sqlStr(t.category), sqlStr(t.task), sqlTextArr(t.responsible),
        t.due_date ? sqlStr(t.due_date) : 'NULL', sqlStr(t.status),
        sqlStr(t.supplies), sqlStr(t.notes), t.sort_order,
      ].join(',') + ');\n';
  }

  sql += '\ncommit;\n';
  fs.writeFileSync(OUT, sql, 'utf8');

  const byDay = {};
  records.forEach((t) => { byDay[t.day] = (byDay[t.day] || 0) + 1; });
  console.log(`완료: 업무 ${records.length}개 → ${OUT}`);
  console.log('일자별:', JSON.stringify(byDay));
}

main();
