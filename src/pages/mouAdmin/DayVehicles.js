import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, PrimaryButton, GhostButton,
  Message, Empty, AssignGrid, AssignCard, AssignCardHead, AssignCardTitle,
  CapTag, Chip, ChipRow, Pool, Select, IconButton, Badge, MiniInput,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchVehicleGroups, upsertTrainGroup, updateTrainGroup, deleteTrainGroup,
  fetchStaff, buildStaffGroups, memberBadgeStyle, displayName, headcount, toCsv, downloadCsv,
} from '../../services/mouAdmin';
import CrewSelect from './CrewSelect';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

/**
 * 활동별 차량 배정 (기차 Pikes Peak / Garden of Gods / Coors 공용)
 * props: participants, activity('train'|'garden'|'coors'), label, presets=[], badgeBg, badgeColor
 */
const DayVehicles = ({
  participants,
  activity,
  label,
  presets = ['밴1', '밴2', 'SUV'],
  badgeBg = 'rgba(155,89,182,0.1)',
  badgeColor = '#7d3c98',
}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [staff, setStaff] = useState([]);

  useEffect(() => { fetchStaff().then(setStaff).catch(() => {}); }, []);
  const staffByGroup = useMemo(() => buildStaffGroups(staff, participants), [staff, participants]);

  const riders = useMemo(
    () => participants.filter((p) => (p.programs || []).includes(activity)),
    [participants, activity]
  );
  // 배정 가능 풀 = 해당 활동 신청자 + 준비위원회(프로그램 무관 배정 허용)
  const eligible = useMemo(() => {
    const seen = new Set();
    return participants.filter((p) => {
      const ok = (p.programs || []).includes(activity) || p.member_type === '준비위원회';
      if (ok && !seen.has(p.id)) { seen.add(p.id); return true; }
      return false;
    });
  }, [participants, activity]);
  const pMap = useMemo(() => {
    const m = {};
    participants.forEach((p) => { m[p.id] = p; });
    return m;
  }, [participants]);

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setGroups(await fetchVehicleGroups(activity));
    } catch (e) {
      setMsg({ error: true, text: `차량 목록을 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, [activity]);
  useEffect(() => { load(); }, [load]);

  const assignedIds = useMemo(() => {
    const s = new Set();
    groups.forEach((g) => (g.passenger_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [groups]);

  const unassigned = useMemo(
    () => eligible.filter((p) => !assignedIds.has(p.id)),
    [eligible, assignedIds]
  );

  const seatsOf = (ids) => (ids || []).reduce((s, id) => s + headcount(pMap[id]), 0);
  const riderHead = useMemo(() => riders.reduce((s, p) => s + headcount(p), 0), [riders]);
  const unassignedHead = useMemo(() => unassigned.reduce((s, p) => s + headcount(p), 0), [unassigned]);

  const save = async (grp, patch) => {
    try {
      const next = { ...grp, ...patch };
      setGroups((prev) => prev.map((g) => (g.id === grp.id ? next : g)));
      await updateTrainGroup(grp.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addGroup = async (vlabel) => {
    const grp = {
      id: newId(),
      activity,
      vehicle_label: vlabel || `차량 ${groups.length + 1}`,
      driver: '', leader: '', volunteer: '',
      capacity: vlabel === 'SUV' ? 6 : 9,
      passenger_ids: [],
    };
    try { await upsertTrainGroup(grp); load(); }
    catch (e) { setMsg({ error: true, text: `차량 생성 실패: ${e.message}` }); }
  };

  const removeGroup = async (id) => {
    if (!window.confirm('이 차량을 삭제할까요?')) return;
    try { await deleteTrainGroup(id); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const addPassenger = (grp, pid) => { if (pid) save(grp, { passenger_ids: [...(grp.passenger_ids || []), pid] }); };
  const removePassenger = (grp, pid) => save(grp, { passenger_ids: (grp.passenger_ids || []).filter((x) => x !== pid) });

  const exportCsv = () => {
    const csv = toCsv(groups, [
      { label: '차량', key: 'vehicle_label' },
      { label: '운전자', key: 'driver' },
      { label: '인솔자', key: 'leader' },
      { label: '봉사자', key: 'volunteer' },
      { label: '정원', key: 'capacity' },
      { label: '인원', value: (g) => seatsOf(g.passenger_ids) },
      { label: '탑승자', value: (g) => (g.passenger_ids || []).map((id) => displayName(pMap[id])).join(' | ') },
    ]);
    downloadCsv(`mou_${activity}_vehicles.csv`, csv);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>{label} 차량 배정 · 대상 {riderHead}명(동반자 포함) · 차량 {groups.length}대 · 미배정 {unassignedHead}명</CardTitle>
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
          {presets.map((p) => (
            <GhostButton key={p} onClick={() => addGroup(p)}>+ {p}</GhostButton>
          ))}
          <PrimaryButton onClick={() => addGroup()}>+ 차량</PrimaryButton>
        </span>
      </CardHead>
      <CardBody>
        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem', color: '#374151' }}>
                미배정 ({unassignedHead}명, 동반자 포함)
              </div>
              <Pool>
                {unassigned.length === 0
                  ? <Empty>모든 인원이 차량에 배정되었습니다 🎉</Empty>
                  : unassigned.map((p) => {
                    const cc = p.companion_count || (p.has_companion ? 1 : 0);
                    const st = memberBadgeStyle(p.member_type);
                    return (
                      <Badge key={p.id} $bg={st.bg} $color={st.color}>
                        {displayName(p)}{st.tag ? ` · ${st.tag}` : ''}{cc > 0 ? ` +${cc}` : ''}
                      </Badge>
                    );
                  })}
              </Pool>
            </div>

            {groups.length === 0 ? (
              <Empty>차량이 없습니다. 위 버튼으로 추가하세요.</Empty>
            ) : (
              <AssignGrid>
                {groups.map((grp) => {
                  const pax = grp.passenger_ids || [];
                  const seats = seatsOf(pax);
                  const over = seats > (grp.capacity || 9);
                  return (
                    <AssignCard key={grp.id} $over={over}>
                      <AssignCardHead>
                        <AssignCardTitle>
                          <MiniInput
                            defaultValue={grp.vehicle_label || ''}
                            onBlur={(e) => save(grp, { vehicle_label: e.target.value })}
                            style={{ width: 110 }}
                          />
                        </AssignCardTitle>
                        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <CapTag $over={over}>{seats}/{grp.capacity}석</CapTag>
                          <IconButton onClick={() => removeGroup(grp.id)}>삭제</IconButton>
                        </span>
                      </AssignCardHead>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>운전자</div>
                          <CrewSelect value={grp.driver} groups={staffByGroup} onChange={(v) => save(grp, { driver: v })} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>인솔자</div>
                          <CrewSelect value={grp.leader} groups={staffByGroup} onChange={(v) => save(grp, { leader: v })} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>봉사자</div>
                          <CrewSelect value={grp.volunteer} groups={staffByGroup} onChange={(v) => save(grp, { volunteer: v })} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>정원</div>
                          <MiniInput
                            type="number"
                            defaultValue={grp.capacity || 9}
                            onBlur={(e) => save(grp, { capacity: parseInt(e.target.value, 10) || 9 })}
                          />
                        </div>
                      </div>

                      <ChipRow>
                        {pax.map((pid) => {
                          const cc = pMap[pid]?.companion_count || (pMap[pid]?.has_companion ? 1 : 0);
                          return (
                            <Chip key={pid}>
                              {displayName(pMap[pid]) || '(알수없음)'}{cc > 0 ? ` +${cc}` : ''}
                              <button onClick={() => removePassenger(grp, pid)} title="제거">✕</button>
                            </Chip>
                          );
                        })}
                        {pax.length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>탑승자 없음</span>}
                      </ChipRow>

                      <Select defaultValue="" onChange={(e) => { addPassenger(grp, e.target.value); e.target.value = ''; }}>
                        <option value="">+ 탑승자 배정</option>
                        {unassigned.map((p) => (
                          <option key={p.id} value={p.id}>
                            {displayName(p)} · {p.member_type === '준비위원회' ? '준비위원회' : p.chapter}
                          </option>
                        ))}
                      </Select>
                    </AssignCard>
                  );
                })}
              </AssignGrid>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default DayVehicles;
