import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Input, Select, PrimaryButton,
  GhostButton, Message, Empty, AssignGrid, AssignCard, AssignCardHead,
  AssignCardTitle, CapTag, Chip, ChipRow, Pool, PoolChip, IconButton, Badge,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchRooms, upsertRoom, updateRoom, deleteRoom, displayName, nightsBetween, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const nightsOf = (p) => (p ? nightsBetween(p.arrival_date, p.departure_date) : null);
const shortDate = (d) => {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length < 3) return d;
  return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
};
// "6/25 · 2박" 형태 (체크인 날짜 + 박수)
const stayLabel = (p) => {
  if (!p) return '';
  const ci = shortDate(p.arrival_date);
  const n = nightsOf(p);
  if (ci && n != null) return `${ci}·${n}박`;
  if (ci) return ci;
  if (n != null) return `${n}박`;
  return '';
};
const stayTitle = (p) => {
  if (!p) return '';
  const a = p.arrival_date || '미정';
  const b = p.departure_date || '미정';
  return `입국 ${a} · 출국 ${b}`;
};

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const Rooms = ({ participants }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [newNo, setNewNo] = useState('');
  const [newType, setNewType] = useState('2인실');

  const pMap = useMemo(() => {
    const m = {};
    participants.forEach((p) => { m[p.id] = p; });
    return m;
  }, [participants]);

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setRooms(await fetchRooms());
    } catch (e) {
      setMsg({ error: true, text: `방 목록을 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 자연 정렬: 1인-1, 1인-2, ... 1인-10 (문자열 정렬이 아닌 숫자 인식)
  const sortedRooms = useMemo(
    () => rooms.slice().sort((a, b) =>
      String(a.room_no || '').localeCompare(String(b.room_no || ''), undefined, { numeric: true, sensitivity: 'base' })
    ),
    [rooms]
  );

  const assignedIds = useMemo(() => {
    const s = new Set();
    rooms.forEach((r) => (r.occupant_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [rooms]);

  const unassigned = useMemo(
    () => participants.filter((p) => !assignedIds.has(p.id)),
    [participants, assignedIds]
  );

  // 참가자 → 현재 배정된 방 (중복이면 첫 방)
  const roomOfMap = useMemo(() => {
    const m = {};
    rooms.forEach((r) => (r.occupant_ids || []).forEach((id) => { if (!m[id]) m[id] = r; }));
    return m;
  }, [rooms]);

  // 다른 방에 배정된 사람(이동 후보)
  const movable = useMemo(
    () => participants
      .filter((p) => roomOfMap[p.id])
      .sort((a, b) => displayName(a).localeCompare(displayName(b), 'ko')),
    [participants, roomOfMap]
  );

  const save = async (room, patch) => {
    try {
      const next = { ...room, ...patch };
      // 낙관적 업데이트
      setRooms((prev) => prev.map((r) => (r.id === room.id ? next : r)));
      await updateRoom(room.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  // 타입별 다음 번호 자동 생성 (1인-N / 2인-N)
  const nextRoomNo = (type) => {
    const prefix = type === '1인실' ? '1인' : '2인';
    const nums = rooms
      .map((r) => {
        const m = String(r.room_no || '').match(new RegExp(`^${prefix}-(\\d+)$`));
        return m ? parseInt(m[1], 10) : null;
      })
      .filter((n) => n != null);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}-${next}`;
  };

  const addRoom = async () => {
    const room = {
      id: newId(),
      room_no: newNo || nextRoomNo(newType),
      room_type: newType,
      capacity: newType === '1인실' ? 1 : 2,
      occupant_ids: [],
    };
    try {
      await upsertRoom(room);
      setNewNo('');
      load();
    } catch (e) {
      setMsg({ error: true, text: `방 생성 실패: ${e.message}` });
    }
  };

  // 타입별로 1인-N / 2인-N 을 빈 번호 없이 연속 번호로 재정렬
  const renumberRooms = async (list) => {
    const updates = [];
    ['1인', '2인'].forEach((prefix) => {
      const re = new RegExp(`^${prefix}-(\\d+)$`);
      const group = list
        .filter((r) => re.test(r.room_no || ''))
        .sort((a, b) => parseInt(a.room_no.match(re)[1], 10) - parseInt(b.room_no.match(re)[1], 10));
      group.forEach((r, i) => {
        const want = `${prefix}-${i + 1}`;
        if (r.room_no !== want) updates.push({ id: r.id, room_no: want });
      });
    });
    for (const u of updates) {
      // eslint-disable-next-line no-await-in-loop
      await updateRoom(u.id, { room_no: u.room_no });
    }
  };

  const removeRoom = async (id) => {
    if (!window.confirm('이 방을 삭제할까요? (배정 인원은 미배정으로 돌아갑니다)')) return;
    try {
      await deleteRoom(id);
      await renumberRooms(rooms.filter((r) => r.id !== id)); // 남은 방 번호 당기기
      load();
    } catch (e) {
      setMsg({ error: true, text: `삭제 실패: ${e.message}` });
      load();
    }
  };

  const addOccupant = (room, pid) => {
    if (!pid) return;
    // 1인 1방 보장: 다른 방(들)에 있으면 거기서 빼고 이동
    rooms.forEach((r) => {
      if (r.id !== room.id && (r.occupant_ids || []).includes(pid)) {
        save(r, { occupant_ids: (r.occupant_ids || []).filter((x) => x !== pid) });
      }
    });
    if (!(room.occupant_ids || []).includes(pid)) {
      save(room, { occupant_ids: [...(room.occupant_ids || []), pid] });
    }
  };
  const removeOccupant = (room, pid) => {
    save(room, { occupant_ids: (room.occupant_ids || []).filter((x) => x !== pid) });
  };

  const exportCsv = () => {
    const csv = toCsv(rooms, [
      { label: 'Room#', key: 'room_no' },
      { label: '타입', key: 'room_type' },
      { label: '정원', key: 'capacity' },
      { label: '입실인원', value: (r) => (r.occupant_ids || []).length },
      { label: '명단', value: (r) => (r.occupant_ids || []).map((id) => {
        const p = pMap[id]; const sl = stayLabel(p);
        return `${displayName(p)}${sl ? ` (${sl})` : ''}`;
      }).join(' | ') },
    ]);
    downloadCsv('mou_rooms.csv', csv);
  };

  const totalSingles = rooms.filter((r) => r.room_type === '1인실').length;
  const totalDoubles = rooms.filter((r) => r.room_type === '2인실').length;

  return (
    <Card>
      <CardHead>
        <CardTitle>
          호텔 방 배정 · 방 {rooms.length}개 (1인실 {totalSingles} / 2인실 {totalDoubles}) · 미배정 {unassigned.length}명
        </CardTitle>
        <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
      </CardHead>
      <CardBody>
        <Toolbar>
          <Input placeholder="방 번호 (예: 101)" value={newNo} onChange={(e) => setNewNo(e.target.value)} style={{ width: 160 }} />
          <Select value={newType} onChange={(e) => setNewType(e.target.value)}>
            <option value="2인실">2인실</option>
            <option value="1인실">1인실</option>
          </Select>
          <PrimaryButton onClick={addRoom}>+ 방 추가</PrimaryButton>
        </Toolbar>

        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem', color: '#374151' }}>
                미배정 참가자 ({unassigned.length}명) — 클릭 후 방 카드의 “+ 배정” 사용
              </div>
              <Pool>
                {unassigned.length === 0
                  ? <Empty>모든 참가자가 배정되었습니다 🎉</Empty>
                  : unassigned.map((p) => (
                    <Badge key={p.id} title={stayTitle(p)} $bg="rgba(230,126,34,0.1)" $color="#b9530a">
                      {displayName(p)}{stayLabel(p) ? ` · ${stayLabel(p)}` : ''}
                    </Badge>
                  ))}
              </Pool>
            </div>

            {rooms.length === 0 ? (
              <Empty>아직 생성된 방이 없습니다. 위에서 방을 추가하세요.</Empty>
            ) : (
              <AssignGrid>
                {sortedRooms.map((room) => {
                  const occ = room.occupant_ids || [];
                  const over = occ.length > (room.capacity || 2);
                  return (
                    <AssignCard key={room.id} $over={over}>
                      <AssignCardHead>
                        <AssignCardTitle>
                          {room.room_no} <Badge>{room.room_type}</Badge>
                        </AssignCardTitle>
                        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <CapTag $over={over}>{occ.length}/{room.capacity}</CapTag>
                          <IconButton onClick={() => removeRoom(room.id)}>삭제</IconButton>
                        </span>
                      </AssignCardHead>
                      <ChipRow>
                        {occ.map((pid) => (
                          <Chip key={pid} title={stayTitle(pMap[pid])}>
                            {displayName(pMap[pid]) || '(알수없음)'}
                            {stayLabel(pMap[pid]) && (
                              <span style={{ fontWeight: 800, marginLeft: 2 }}>· {stayLabel(pMap[pid])}</span>
                            )}
                            <button onClick={() => removeOccupant(room, pid)} title="제거">✕</button>
                          </Chip>
                        ))}
                        {occ.length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>비어 있음</span>}
                      </ChipRow>
                      {room.notes && (
                        <div style={{ fontSize: '0.78rem', color: room.notes.startsWith('동반자') ? '#1f5a7a' : '#b9530a' }}>
                          {room.notes.startsWith('동반자') ? '👤 ' : '⚠ '}{room.notes}
                        </div>
                      )}
                      <Select defaultValue="" onChange={(e) => { addOccupant(room, e.target.value); e.target.value = ''; }}>
                        <option value="">+ 배정 / 이동</option>
                        <optgroup label="미배정">
                          {unassigned.map((p) => (
                            <option key={p.id} value={p.id}>
                              {displayName(p)}{stayLabel(p) ? ` · ${stayLabel(p)}` : ''} · {p.chapter}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="다른 방에서 이동">
                          {movable.filter((p) => roomOfMap[p.id] && roomOfMap[p.id].id !== room.id).map((p) => (
                            <option key={p.id} value={p.id}>
                              {displayName(p)} · 현재 {roomOfMap[p.id].room_no}
                            </option>
                          ))}
                        </optgroup>
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

export default Rooms;
