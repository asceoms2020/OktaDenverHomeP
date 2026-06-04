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
  const { error } = await db()
    .from('mou_participants')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
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

// ---------- 공통 유틸 ----------
export const PROGRAM_LABELS = {
  golf: '골프',
  train: '기차(Pikes Peak)',
  garden: 'Garden of Gods',
  coors: 'Coors',
  springs: 'Colorado Springs',
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
