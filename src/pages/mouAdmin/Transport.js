import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Input, Select, PrimaryButton,
  GhostButton, Message, Empty, AssignGrid, AssignCard, AssignCardHead,
  AssignCardTitle, CapTag, Chip, ChipRow, Pool, IconButton, Badge, MiniInput,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchTrips, upsertTrip, updateTrip, deleteTrip, updateParticipant,
  fetchStaff, buildStaffGroups, memberBadgeStyle, displayName, headcount, toCsv, downloadCsv,
} from '../../services/mouAdmin';
import CrewSelect from './CrewSelect';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const DIRECTIONS = [
  { key: 'pickup_in', label: '입국 픽업', dateField: 'arrival_date', timeField: 'arrival_time', flightField: 'arrival_flight' },
  { key: 'dropoff_out', label: '출국 드랍', dateField: 'departure_date', timeField: 'departure_time', flightField: 'departure_flight' },
];

const Transport = ({ participants }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [dir, setDir] = useState('pickup_in');
  const [staff, setStaff] = useState([]);

  useEffect(() => { fetchStaff().then(setStaff).catch(() => {}); }, []);
  const staffByGroup = useMemo(() => buildStaffGroups(staff, participants), [staff, participants]);

  const pMap = useMemo(() => {
    const m = {};
    participants.forEach((p) => { m[p.id] = p; });
    return m;
  }, [participants]);

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setTrips(await fetchTrips());
    } catch (e) {
      setMsg({ error: true, text: `운행 목록을 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const dirCfg = DIRECTIONS.find((d) => d.key === dir);
  const dirTrips = useMemo(
    () => trips.filter((t) => t.trip_type === dir),
    [trips, dir]
  );

  const assignedIds = useMemo(() => {
    const s = new Set();
    dirTrips.forEach((t) => (t.passenger_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [dirTrips]);

  // 이 방향에서 아직 차량 미배정인 참가자 (해당 날짜/시간 정보 표시)
  const unassigned = useMemo(
    () => participants.filter((p) => !assignedIds.has(p.id)),
    [participants, assignedIds]
  );

  const seatsOf = (ids) => (ids || []).reduce((s, id) => s + headcount(pMap[id]), 0);
  const unassignedHead = useMemo(() => unassigned.reduce((s, p) => s + headcount(p), 0), [unassigned]);

  // 탑승자 배정 드롭다운: 날짜 → 이름 순 정렬
  const unassignedSorted = useMemo(() => {
    const f = dirCfg.dateField;
    return unassigned.slice().sort((a, b) => {
      const da = a[f] || '9999-99-99';
      const db = b[f] || '9999-99-99';
      if (da !== db) return da < db ? -1 : 1;
      return String(a.name_ko || a.name_en || '').localeCompare(String(b.name_ko || b.name_en || ''), 'ko');
    });
  }, [unassigned, dirCfg]);

  const timeKey = (p) => p[dirCfg.timeField] || '99:99';

  // 항공 시간 기준 그룹 제안 (날짜 → 시간순 인원)
  const dateGroups = useMemo(() => {
    const g = {};
    unassigned.forEach((p) => {
      const d = p[dirCfg.dateField] || '미정';
      (g[d] = g[d] || []).push(p);
    });
    return Object.keys(g).sort().map((d) => {
      const people = g[d].slice().sort((a, b) => timeKey(a).localeCompare(timeKey(b)));
      const times = people.map((p) => p[dirCfg.timeField]).filter(Boolean);
      return { date: d, people, span: times.length ? `${times[0]}~${times[times.length - 1]}` : '시간미정' };
    });
  }, [unassigned, dirCfg]);

  // 차량 탑승객의 항공 시간대 (이르~늦)
  const tripSpan = (trip) => {
    const times = (trip.passenger_ids || [])
      .map((id) => pMap[id] && pMap[id][dirCfg.timeField])
      .filter(Boolean)
      .sort();
    return times.length ? `${times[0]}~${times[times.length - 1]}` : null;
  };

  const save = async (trip, patch) => {
    try {
      const next = { ...trip, ...patch };
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? next : t)));
      await updateTrip(trip.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addTrip = async (presetDate) => {
    const trip = {
      id: newId(),
      trip_type: dir,
      trip_date: presetDate && presetDate !== '미정' ? presetDate : null,
      trip_time: '',
      vehicle_label: `밴 ${dirTrips.length + 1}`,
      capacity: 9,
      driver: '',
      passenger_ids: [],
    };
    try {
      await upsertTrip(trip);
      load();
    } catch (e) {
      setMsg({ error: true, text: `운행 생성 실패: ${e.message}` });
    }
  };

  const removeTrip = async (id) => {
    if (!window.confirm('이 운행을 삭제할까요?')) return;
    try { await deleteTrip(id); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const addPassenger = (trip, pid) => {
    if (!pid) return;
    save(trip, { passenger_ids: [...(trip.passenger_ids || []), pid] });
  };
  const removePassenger = (trip, pid) => {
    save(trip, { passenger_ids: (trip.passenger_ids || []).filter((x) => x !== pid) });
  };

  // 항공편/시간 인라인 보정 (참가자 테이블 업데이트)
  const updateFlight = async (p, field, value) => {
    try {
      await updateParticipant(p.id, { [field]: value });
      // 부모 participants는 다음 새로고침 때 반영. 여기선 메시지만.
    } catch (e) {
      setMsg({ error: true, text: `항공정보 저장 실패: ${e.message}` });
    }
  };

  const exportCsv = () => {
    const csv = toCsv(dirTrips, [
      { label: '구분', value: () => dirCfg.label },
      { label: '날짜', key: 'trip_date' },
      { label: '시간', key: 'trip_time' },
      { label: '차량', key: 'vehicle_label' },
      { label: '운전자', key: 'driver' },
      { label: '인솔자', key: 'leader' },
      { label: '봉사자', key: 'volunteer' },
      { label: '정원', key: 'capacity' },
      { label: '탑승인원', value: (t) => (t.passenger_ids || []).length },
      { label: '탑승자', value: (t) => (t.passenger_ids || []).map((id) => displayName(pMap[id])).join(' | ') },
    ]);
    downloadCsv(`mou_transport_${dir}.csv`, csv);
  };

  // 날짜 = 미배정 인원 날짜 ∪ 밴(trip) 날짜 (미정은 맨 뒤)
  const allDates = useMemo(() => {
    const set = new Set();
    dateGroups.forEach((g) => set.add(g.date));
    dirTrips.forEach((t) => set.add(t.trip_date || '미정'));
    return Array.from(set).sort((a, b) => {
      if (a === b) return 0;
      if (a === '미정') return 1;
      if (b === '미정') return -1;
      return a < b ? -1 : 1;
    });
  }, [dateGroups, dirTrips]);

  const renderTrip = (trip) => {
    const pax = trip.passenger_ids || [];
    const seats = seatsOf(pax);
    const over = seats > (trip.capacity || 9);
    // 이 밴 날짜에 운행해야 할 미배정자만 (날짜 없는 밴은 전체)
    const dayPool = trip.trip_date
      ? unassignedSorted.filter((p) => p[dirCfg.dateField] === trip.trip_date)
      : unassignedSorted;
    return (
      <AssignCard key={trip.id} $over={over}>
        <AssignCardHead>
          <AssignCardTitle>
            {trip.vehicle_label}
            {tripSpan(trip) && (
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#1f5a7a' }}>
                항공 시간대 {tripSpan(trip)}
              </div>
            )}
          </AssignCardTitle>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <CapTag $over={over}>{seats}/{trip.capacity}석</CapTag>
            <IconButton onClick={() => removeTrip(trip.id)}>삭제</IconButton>
          </span>
        </AssignCardHead>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <MiniInput placeholder="날짜 (YYYY-MM-DD)" defaultValue={trip.trip_date || ''} onBlur={(e) => save(trip, { trip_date: e.target.value || null })} />
          <MiniInput placeholder="시간 (예: 14:30)" defaultValue={trip.trip_time || ''} onBlur={(e) => save(trip, { trip_time: e.target.value })} />
          <MiniInput placeholder="차량 라벨" defaultValue={trip.vehicle_label || ''} onBlur={(e) => save(trip, { vehicle_label: e.target.value })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>운전자</div>
            <CrewSelect value={trip.driver} groups={staffByGroup} onChange={(v) => save(trip, { driver: v })} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>인솔자</div>
            <CrewSelect value={trip.leader} groups={staffByGroup} onChange={(v) => save(trip, { leader: v })} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>봉사자</div>
            <CrewSelect value={trip.volunteer} groups={staffByGroup} onChange={(v) => save(trip, { volunteer: v })} />
          </div>
        </div>

        <ChipRow>
          {pax.map((pid) => {
            const cc = pMap[pid]?.companion_count || (pMap[pid]?.has_companion ? 1 : 0);
            return (
              <Chip key={pid}>
                {displayName(pMap[pid]) || '(알수없음)'}{cc > 0 ? ` +${cc}` : ''}
                <button onClick={() => removePassenger(trip, pid)} title="제거">✕</button>
              </Chip>
            );
          })}
          {pax.length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>탑승자 없음</span>}
        </ChipRow>

        <Select defaultValue="" onChange={(e) => { addPassenger(trip, e.target.value); e.target.value = ''; }}>
          <option value="">+ 탑승자 배정{trip.trip_date ? ` (${trip.trip_date})` : ''}</option>
          {dayPool.map((p) => {
            const cc = p.companion_count || (p.has_companion ? 1 : 0);
            return (
              <option key={p.id} value={p.id}>
                {p[dirCfg.dateField] || '날짜미정'}{p[dirCfg.timeField] ? ` ${p[dirCfg.timeField]}` : ''} · {displayName(p)}{cc > 0 ? ` +${cc}` : ''}
              </option>
            );
          })}
        </Select>
      </AssignCard>
    );
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>공항 픽업/드랍 · {dirCfg.label} · 운행 {dirTrips.length}대 · 미배정 {unassignedHead}명(동반자 포함)</CardTitle>
        <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
      </CardHead>
      <CardBody>
        <Toolbar>
          {DIRECTIONS.map((d) => (
            <GhostButton
              key={d.key}
              onClick={() => setDir(d.key)}
              style={dir === d.key ? { borderColor: 'rgba(46,204,113,0.7)', color: '#1f7a3b', fontWeight: 800 } : {}}
            >
              {d.label}
            </GhostButton>
          ))}
          <PrimaryButton onClick={() => addTrip()}>+ 9인승 밴 추가</PrimaryButton>
        </Toolbar>

        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', color: '#374151' }}>
              {dirCfg.label} · 날짜별 미배정 {unassignedHead}명 · 운행 {dirTrips.length}대
            </div>

            {allDates.length === 0 && dirTrips.length === 0 ? (
              <Empty>미배정 인원이 없습니다. “+ 9인승 밴 추가”로 운행을 만들 수 있습니다.</Empty>
            ) : (
              allDates.map((date) => {
                const grp = dateGroups.find((g) => g.date === date);
                const dayTrips = dirTrips.filter((t) => (t.trip_date || '미정') === date);
                const label = date === '미정' ? '날짜 미지정' : date;
                return (
                  <div key={date} style={{ marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid rgba(17,24,39,0.06)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                      <Badge $bg="rgba(52,152,219,0.14)" $color="#1f5a7a" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                        {label}{grp ? ` · 미배정 ${grp.people.reduce((s, p) => s + headcount(p), 0)}명(동반자 포함) · ${grp.span}` : ''}
                      </Badge>
                      <GhostButton onClick={() => addTrip(date === '미정' ? undefined : date)}>+ 이 날짜로 밴 생성</GhostButton>
                    </div>

                    {grp && grp.people.length > 0 && (
                      <Pool style={{ marginBottom: 12 }}>
                        {grp.people.map((p) => {
                          const st = memberBadgeStyle(p.member_type);
                          const cc = p.companion_count || (p.has_companion ? 1 : 0);
                          return (
                            <Badge key={p.id} $bg={st.bg} $color={st.color}>
                              {displayName(p)}{st.tag ? ` · ${st.tag}` : ''}{cc > 0 ? ` +${cc}` : ''}{p[dirCfg.timeField] ? ` ${p[dirCfg.timeField]}` : ''}
                            </Badge>
                          );
                        })}
                      </Pool>
                    )}

                    {dayTrips.length > 0 && (
                      <AssignGrid>{dayTrips.map(renderTrip)}</AssignGrid>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Transport;
