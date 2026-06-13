import { getAuthenticatedClient } from '../lib/supabaseClient';

/**
 * MOU 이벤트 관리 — Supabase CRUD 서비스
 * 모든 mou_* 테이블은 관리자(RLS)만 접근 가능하므로
 * 읽기/쓰기 모두 인증 클라이언트(getAuthenticatedClient)를 사용한다.
 */
const db = () => getAuthenticatedClient();

// ---------- 참가자 ----------
export const fetchParticipants = async () => {
  const { data, error } = await db()
    .from('mou_participants')
    .select('*')
    .order('chapter', { ascending: true })
    .order('name_ko', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const updateParticipant = async (id, patch) => {
  const { data, error } = await db()
    .from('mou_participants')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('대상 참가자를 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도하세요.');
  }
};

export const insertParticipant = async (row) => {
  const { data, error } = await db()
    .from('mou_participants')
    .insert([row])
    .select('id')
    .limit(1);
  if (error) throw error;
  return data?.[0]?.id;
};

export const deleteParticipant = async (id) => {
  const { error } = await db().from('mou_participants').delete().eq('id', id);
  if (error) throw error;
};

/**
 * 납부 체크 토글 — 누가/언제 체크했는지 기록.
 * @param {object} p 참가자 행
 * @param {boolean} received 새 납부 상태
 * @param {string} adminName 체크하는 관리자 표시명
 */
export const setPaymentReceived = async (p, received, adminName) => {
  const patch = received
    ? {
        payment_received: true,
        payment_checked_by: adminName || '관리자',
        payment_checked_at: new Date().toISOString(),
      }
    : {
        payment_received: false,
        payment_checked_by: null,
        payment_checked_at: null,
      };
  await updateParticipant(p.id, patch);
  return patch;
};

/**
 * 체크인 토글 — 누가/언제 체크인했는지 기록.
 */
export const setCheckedIn = async (p, value, adminName) => {
  const patch = value
    ? {
        checked_in: true,
        checked_in_by: adminName || '관리자',
        checked_in_at: new Date().toISOString(),
      }
    : { checked_in: false, checked_in_by: null, checked_in_at: null };
  await updateParticipant(p.id, patch);
  return patch;
};

/** 1명 + 동반자 인원 = 실제 헤드카운트 */
export const headcount = (p) => 1 + (p?.companion_count || (p?.has_companion ? 1 : 0));

/** 숙박비 추가요금 납부 토글 — 누가/언제 체크했는지 기록 */
export const setLodgingPaid = async (p, value, adminName) => {
  const patch = value
    ? { lodging_paid: true, lodging_paid_by: adminName || '관리자', lodging_paid_at: new Date().toISOString() }
    : { lodging_paid: false, lodging_paid_by: null, lodging_paid_at: null };
  await updateParticipant(p.id, patch);
  return patch;
};

/** 두 날짜(YYYY-MM-DD) 사이 박수. 없으면 null */
export const nightsBetween = (arrival, departure) => {
  if (!arrival || !departure) return null;
  const [ay, am, ad] = String(arrival).split('-').map(Number);
  const [by, bm, bd] = String(departure).split('-').map(Number);
  if (!ay || !by) return null;
  const A = Date.UTC(ay, am - 1, ad);
  const B = Date.UTC(by, bm - 1, bd);
  const d = Math.round((B - A) / 86400000);
  return d >= 0 ? d : null;
};

/** 받아야 할 박수 = 3박부터 추가요금 (총박수 - 2, 최소 0) */
export const payableNights = (totalNights) =>
  totalNights == null ? null : Math.max(0, totalNights - 2);

// ---------- 방 배정 ----------
export const fetchRooms = async () => {
  const { data, error } = await db()
    .from('mou_rooms')
    .select('*')
    .order('room_no', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertRoom = async (row) => {
  const { error } = await db().from('mou_rooms').upsert(row).select('id');
  if (error) throw error;
};
export const updateRoom = async (id, patch) => {
  const { error } = await db().from('mou_rooms').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteRoom = async (id) => {
  const { error } = await db().from('mou_rooms').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 공항 교통 ----------
export const fetchTrips = async () => {
  const { data, error } = await db()
    .from('mou_transport_trips')
    .select('*')
    .order('trip_date', { ascending: true })
    .order('trip_time', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertTrip = async (row) => {
  const { error } = await db().from('mou_transport_trips').upsert(row).select('id');
  if (error) throw error;
};
export const updateTrip = async (id, patch) => {
  const { error } = await db().from('mou_transport_trips').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteTrip = async (id) => {
  const { error } = await db().from('mou_transport_trips').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 기차팀 ----------
export const fetchTrainGroups = async () => {
  const { data, error } = await db().from('mou_train_groups').select('*');
  if (error) throw error;
  return data || [];
};
// 활동별 차량 그룹 (train | garden | coors)
export const fetchVehicleGroups = async (activity = 'train') => {
  const { data, error } = await db()
    .from('mou_train_groups')
    .select('*')
    .eq('activity', activity);
  if (error) throw error;
  return data || [];
};
export const upsertTrainGroup = async (row) => {
  const { error } = await db().from('mou_train_groups').upsert(row).select('id');
  if (error) throw error;
};
export const updateTrainGroup = async (id, patch) => {
  const { error } = await db().from('mou_train_groups').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteTrainGroup = async (id) => {
  const { error } = await db().from('mou_train_groups').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 골프팀 ----------
export const fetchGolfTeams = async () => {
  const { data, error } = await db()
    .from('mou_golf_teams')
    .select('*')
    .order('team_no', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertGolfTeam = async (row) => {
  const { error } = await db().from('mou_golf_teams').upsert(row).select('id');
  if (error) throw error;
};
export const updateGolfTeam = async (id, patch) => {
  const { error } = await db().from('mou_golf_teams').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteGolfTeam = async (id) => {
  const { error } = await db().from('mou_golf_teams').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 업무 ----------
export const fetchTasks = async () => {
  const { data, error } = await db()
    .from('mou_tasks')
    .select('*')
    .order('day', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertTask = async (row) => {
  const { error } = await db().from('mou_tasks').upsert(row).select('id');
  if (error) throw error;
};
export const updateTask = async (id, patch) => {
  const { error } = await db().from('mou_tasks').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteTask = async (id) => {
  const { error } = await db().from('mou_tasks').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 일정표 ----------
export const fetchSchedule = async () => {
  const { data, error } = await db()
    .from('mou_schedule')
    .select('*')
    .order('day', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertSchedule = async (row) => {
  const { error } = await db().from('mou_schedule').upsert(row).select('id');
  if (error) throw error;
};
export const updateScheduleRow = async (id, patch) => {
  const { error } = await db().from('mou_schedule').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteScheduleRow = async (id) => {
  const { error } = await db().from('mou_schedule').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 개회식 자리배치 ----------
export const fetchSeatingTables = async () => {
  const { data, error } = await db()
    .from('mou_seating_tables')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
};
export const upsertSeatingTable = async (row) => {
  const { error } = await db().from('mou_seating_tables').upsert(row).select('id');
  if (error) throw error;
};
export const updateSeatingTable = async (id, patch) => {
  const { error } = await db().from('mou_seating_tables').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};
export const deleteSeatingTable = async (id) => {
  const { error } = await db().from('mou_seating_tables').delete().eq('id', id);
  if (error) throw error;
};

// ---------- 운영 인력 명단 (업무 담당자 후보) ----------
export const STAFF_GROUPS = ['봉사자', '준비위원회', '덴버회원'];

/** 구분별 풀 배지 색상 — 준비위(파랑) / 차세대봉사자(주황) / 일반(초록) */
export const memberBadgeStyle = (memberType) => {
  if (memberType === '준비위원회') return { bg: 'rgba(52,152,219,0.14)', color: '#1f5a7a', tag: '준비위' };
  if (memberType === '차세대봉사자') return { bg: 'rgba(243,156,18,0.18)', color: '#b9770a', tag: '봉사단' };
  return { bg: 'rgba(46,204,113,0.12)', color: '#1f7a3b', tag: '' };
};

/**
 * 담당자 후보 그룹 = mou_staff + 참가자(차세대봉사자/준비위원회/덴버지회) 병합.
 * 참가자 탭에서 구분을 바꾼 사람도 드롭다운에 자동 반영. 이름 중복은 제거.
 */
const MEMBER_TO_GROUP = { 차세대봉사자: '봉사자', 준비위원회: '준비위원회', 덴버지회: '덴버회원' };
export const buildStaffGroups = (staff, participants = []) => {
  const g = {};
  STAFF_GROUPS.forEach((k) => { g[k] = []; });
  const seen = new Set();
  (staff || []).forEach((s) => {
    (g[s.role_group] = g[s.role_group] || []).push(s);
    seen.add(`${s.role_group}|${s.name}`);
  });
  (participants || []).forEach((p) => {
    const rg = MEMBER_TO_GROUP[p.member_type];
    if (!rg) return;
    const name = p.name_ko || p.name_en;
    if (!name) return;
    const key = `${rg}|${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    (g[rg] = g[rg] || []).push({ id: p.id, name, role_group: rg, title: p.position || p.chapter || '' });
  });
  return g;
};

export const fetchStaff = async () => {
  const { data, error } = await db()
    .from('mou_staff')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// ---------- 공통 유틸 ----------
export const PROGRAM_LABELS = {
  golf: '골프',
  train: '기차(Pikes Peak)',
  garden: 'Garden of Gods',
  coors: 'Coors',
  springs: 'Colorado Springs',
};

/** 방 배정(occupant_ids) → { 참가자id: room_no } 매핑. 참가자 Room# 표시의 단일 기준. */
export const buildRoomMap = (rooms) => {
  const m = {};
  (rooms || []).forEach((r) => (r.occupant_ids || []).forEach((id) => { m[id] = r.room_no; }));
  return m;
};

/** 방 배정 → { 참가자id: room_type(1인실|2인실) } 매핑 */
export const buildRoomTypeMap = (rooms) => {
  const m = {};
  (rooms || []).forEach((r) => (r.occupant_ids || []).forEach((id) => { m[id] = r.room_type; }));
  return m;
};

export const displayName = (p) => {
  if (!p) return '';
  return [p.name_ko, p.name_en].filter(Boolean).join(' / ') || '(이름없음)';
};

/** 금액 문자열("$400 (1인1실)" 등)에서 숫자만 추출 */
export const parseAmount = (s) => {
  if (!s) return 0;
  const m = String(s).replace(/,/g, '').match(/\$?\s*(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

/** 배열 데이터를 CSV 문자열로 변환 (구글시트 동기화용 내보내기) */
export const toCsv = (rows, columns) => {
  const esc = (v) => {
    const s = v == null ? '' : String(Array.isArray(v) ? v.join(' | ') : v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => esc(c.label)).join(',');
  const body = rows
    .map((r) => columns.map((c) => esc(typeof c.value === 'function' ? c.value(r) : r[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}`;
};

export const downloadCsv = (filename, csv) => {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
