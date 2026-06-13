import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, PrimaryButton, GhostButton, Select, MiniInput,
  Message, Empty, Pool, Chip, ChipRow, Badge, IconButton, CapTag,
  Ballroom, StageBar, BeverageBar, TablesArea, TableBox, TableCircle, SeatDot,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchSeatingTables, upsertSeatingTable, updateSeatingTable, deleteSeatingTable,
  displayName, headcount, memberBadgeStyle, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const KINDS = { normal: '일반', staff: '스태프', vip: 'VIP' };
const kindStyle = (kind) => {
  if (kind === 'staff') return { bg: 'rgba(149,165,166,0.18)', color: '#5d6d7e', ring: 'rgba(149,165,166,0.6)' };
  if (kind === 'vip') return { bg: 'rgba(243,156,18,0.18)', color: '#b9770a', ring: 'rgba(243,156,18,0.7)' };
  return { bg: 'rgba(46,204,113,0.14)', color: '#1f7a3b', ring: 'rgba(46,204,113,0.6)' };
};

const Seating = ({ participants }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [selId, setSelId] = useState(null);

  const pMap = useMemo(() => {
    const m = {};
    participants.forEach((p) => { m[p.id] = p; });
    return m;
  }, [participants]);

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setTables(await fetchSeatingTables());
    } catch (e) {
      setMsg({ error: true, text: `자리배치를 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const seatedIds = useMemo(() => {
    const s = new Set();
    tables.forEach((t) => (t.occupant_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [tables]);

  const tableOf = useMemo(() => {
    const m = {};
    tables.forEach((t) => (t.occupant_ids || []).forEach((id) => { if (!m[id]) m[id] = t; }));
    return m;
  }, [tables]);

  const unassigned = useMemo(
    () => participants.filter((p) => !seatedIds.has(p.id)).sort((a, b) => displayName(a).localeCompare(displayName(b), 'ko')),
    [participants, seatedIds]
  );
  const seatsOf = (ids) => (ids || []).reduce((s, id) => s + headcount(pMap[id]), 0);
  const unassignedHead = useMemo(() => unassigned.reduce((s, p) => s + headcount(p), 0), [unassigned]);
  const seatedHead = useMemo(() => tables.reduce((s, t) => s + seatsOf(t.occupant_ids), 0), [tables, pMap]);

  const selected = tables.find((t) => t.id === selId) || null;

  // 사진 배치: 1열 4개 → 이후 3개씩
  const tableRows = useMemo(() => {
    const r = [];
    if (tables.length) {
      r.push(tables.slice(0, 4));
      for (let i = 4; i < tables.length; i += 3) r.push(tables.slice(i, i + 3));
    }
    return r;
  }, [tables]);

  const renderTable = (t) => {
    const ks = kindStyle(t.kind);
    const used = seatsOf(t.occupant_ids);
    const cap = t.capacity || 8;
    const over = used > cap;
    return (
      <TableBox key={t.id}>
        {Array.from({ length: cap }).map((_, i) => (
          <SeatDot key={i} $angle={i * (360 / cap)} $on={i < used} />
        ))}
        <TableCircle
          $bg={ks.bg} $color={ks.color} $ring={ks.ring}
          $selected={selId === t.id}
          onClick={() => setSelId(t.id)}
        >
          <span className="t-label">{t.label}{t.kind !== 'normal' ? <><br />{KINDS[t.kind]}</> : ''}</span>
          <span className="t-count" style={over ? { color: '#c0392b' } : undefined}>{used}/{cap}</span>
        </TableCircle>
      </TableBox>
    );
  };

  const save = async (tb, patch) => {
    try {
      const next = { ...tb, ...patch };
      setTables((prev) => prev.map((t) => (t.id === tb.id ? next : t)));
      await updateSeatingTable(tb.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addTable = async (label, kind = 'normal') => {
    const tb = {
      id: newId(),
      label: label || `${tables.length + 1}`,
      kind,
      capacity: 8,
      occupant_ids: [],
      sort_order: tables.length,
    };
    try { await upsertSeatingTable(tb); load(); setSelId(tb.id); }
    catch (e) { setMsg({ error: true, text: `테이블 추가 실패: ${e.message}` }); }
  };

  // 사진 기준 기본 배치 (4 + 3 + 3 = 10테이블, 상단 스태프/VIP)
  const buildDefault = async () => {
    if (tables.length > 0 && !window.confirm('이미 테이블이 있습니다. 기본 배치를 추가할까요?')) return;
    const plan = [
      ['Staff', 'staff'], ['VIP 1', 'vip'], ['VIP 2', 'vip'], ['Staff', 'staff'],
      ['1', 'normal'], ['2', 'normal'], ['3', 'normal'],
      ['4', 'normal'], ['5', 'normal'], ['6', 'normal'],
    ];
    try {
      let order = tables.length;
      for (const [label, kind] of plan) {
        // eslint-disable-next-line no-await-in-loop
        await upsertSeatingTable({ id: newId(), label, kind, capacity: 8, occupant_ids: [], sort_order: order++ });
      }
      load();
    } catch (e) { setMsg({ error: true, text: `기본 배치 생성 실패: ${e.message}` }); }
  };

  const removeTable = async (id) => {
    if (!window.confirm('이 테이블을 삭제할까요? (배정 인원은 미배정으로 돌아갑니다)')) return;
    try { await deleteSeatingTable(id); if (selId === id) setSelId(null); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const addOccupant = (tb, pid) => {
    if (!pid) return;
    tables.forEach((t) => {
      if (t.id !== tb.id && (t.occupant_ids || []).includes(pid)) {
        save(t, { occupant_ids: (t.occupant_ids || []).filter((x) => x !== pid) });
      }
    });
    if (!(tb.occupant_ids || []).includes(pid)) {
      save(tb, { occupant_ids: [...(tb.occupant_ids || []), pid] });
    }
  };
  const removeOccupant = (tb, pid) => save(tb, { occupant_ids: (tb.occupant_ids || []).filter((x) => x !== pid) });

  const exportCsv = () => {
    const csv = toCsv(tables, [
      { label: '테이블', key: 'label' },
      { label: '구분', value: (t) => KINDS[t.kind] || t.kind },
      { label: '인원', value: (t) => seatsOf(t.occupant_ids) },
      { label: '명단', value: (t) => (t.occupant_ids || []).map((id) => displayName(pMap[id])).join(' | ') },
    ]);
    downloadCsv('mou_seating.csv', csv);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>개회식 자리배치 · 테이블 {tables.length}개 · 착석 {seatedHead}명 · 미배정 {unassignedHead}명</CardTitle>
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
          <GhostButton onClick={buildDefault}>기본 배치 생성</GhostButton>
          <PrimaryButton onClick={() => addTable()}>+ 테이블</PrimaryButton>
        </span>
      </CardHead>
      <CardBody>
        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <>
            <Ballroom>
              <StageBar>STAGE · 무대</StageBar>
              <BeverageBar>Beverage station</BeverageBar>
              {tables.length === 0 ? (
                <Empty>테이블이 없습니다. “기본 배치 생성” 또는 “+ 테이블”로 시작하세요.</Empty>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
                  {tableRows.map((row, ri) => (
                    <TablesArea key={ri} style={{ width: '100%' }}>
                      {row.map(renderTable)}
                    </TablesArea>
                  ))}
                </div>
              )}
            </Ballroom>

            {/* 미배정 풀 */}
            <div style={{ margin: '18px 0 8px', fontWeight: 700, fontSize: '0.9rem', color: '#374151' }}>
              미배정 ({unassignedHead}명, 동반자 포함)
            </div>
            <Pool>
              {unassigned.length === 0
                ? <Empty>모든 참가자가 착석 배정되었습니다 🎉</Empty>
                : unassigned.map((p) => {
                  const st = memberBadgeStyle(p.member_type);
                  const cc = p.companion_count || (p.has_companion ? 1 : 0);
                  return (
                    <Badge key={p.id} $bg={st.bg} $color={st.color}>
                      {displayName(p)}{st.tag ? ` · ${st.tag}` : ''}{cc > 0 ? ` +${cc}` : ''}
                    </Badge>
                  );
                })}
            </Pool>

            {/* 선택 테이블 편집 */}
            {selected && (
              <Card style={{ marginTop: 18 }}>
                <CardHead>
                  <CardTitle>
                    테이블 편집 — {selected.label} ({seatsOf(selected.occupant_ids)}/{selected.capacity || 8}명)
                  </CardTitle>
                  <IconButton onClick={() => removeTable(selected.id)}>테이블 삭제</IconButton>
                </CardHead>
                <CardBody>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>이름</span>
                    <MiniInput defaultValue={selected.label || ''} style={{ width: 130 }} onBlur={(e) => save(selected, { label: e.target.value })} />
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>구분</span>
                    <Select value={selected.kind || 'normal'} onChange={(e) => save(selected, { kind: e.target.value })} style={{ padding: '6px 8px' }}>
                      {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </Select>
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>정원</span>
                    <MiniInput type="number" defaultValue={selected.capacity || 8} style={{ width: 60 }} onBlur={(e) => save(selected, { capacity: parseInt(e.target.value, 10) || 8 })} />
                  </div>

                  <ChipRow style={{ marginBottom: 10 }}>
                    {(selected.occupant_ids || []).map((pid) => {
                      const cc = pMap[pid]?.companion_count || (pMap[pid]?.has_companion ? 1 : 0);
                      return (
                        <Chip key={pid}>
                          {displayName(pMap[pid]) || '(알수없음)'}{cc > 0 ? ` +${cc}` : ''}
                          <button onClick={() => removeOccupant(selected, pid)} title="제거">✕</button>
                        </Chip>
                      );
                    })}
                    {(selected.occupant_ids || []).length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>비어 있음</span>}
                  </ChipRow>

                  <Select defaultValue="" onChange={(e) => { addOccupant(selected, e.target.value); e.target.value = ''; }}>
                    <option value="">+ 착석 배정 / 이동</option>
                    <optgroup label="미배정">
                      {unassigned.map((p) => (
                        <option key={p.id} value={p.id}>
                          {displayName(p)}{(p.companion_count || (p.has_companion ? 1 : 0)) > 0 ? ` +${p.companion_count || 1}` : ''} · {p.chapter || p.member_type}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="다른 테이블에서 이동">
                      {participants.filter((p) => tableOf[p.id] && tableOf[p.id].id !== selected.id).map((p) => (
                        <option key={p.id} value={p.id}>{displayName(p)} · 현재 {tableOf[p.id].label}</option>
                      ))}
                    </optgroup>
                  </Select>
                </CardBody>
              </Card>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Seating;
