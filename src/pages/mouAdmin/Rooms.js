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
const nightsLabel = (p) => { const n = nightsOf(p); return n == null ? '' : `${n}박`; };
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

  const addRoom = async () => {
    const room = {
      id: newId(),
      room_no: newNo || `R-${rooms.length + 1}`,
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

  const removeRoom = async (id) => {
    if (!window.confirm('이 방을 삭제할까요? (배정 인원은 미배정으로 돌아갑니다)')) return;
    try {
      await deleteRoom(id);
      load();
    } catch (e) {
      setMsg({ error: true, text: `삭제 실패: ${e.message}` });
    }
  };

  const addOccupant = (room, pid) => {
    if (!pid) return;
    save(room, { occupant_ids: [...(room.occupant_ids || []), pid] });
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
        const p = pMap[id]; const nl = nightsLabel(p);
        return `${displayName(p)}${nl ? ` (${nl})` : ''}`;
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
                      {displayName(p)}{nightsLabel(p) ? ` · ${nightsLabel(p)}` : ''}
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
                            {nightsLabel(pMap[pid]) && (
                              <span style={{ fontWeight: 800, marginLeft: 2 }}>· {nightsLabel(pMap[pid])}</span>
                            )}
                            <button onClick={() => removeOccupant(room, pid)} title="제거">✕</button>
                          </Chip>
                        ))}
                        {occ.length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>비어 있음</span>}
                      </ChipRow>
                      {room.notes && (
                        <div style={{ fontSize: '0.78rem', color: '#b9530a' }}>⚠ {room.notes}</div>
                      )}
                      <Select defaultValue="" onChange={(e) => { addOccupant(room, e.target.value); e.target.value = ''; }}>
                        <option value="">+ 배정 (미배정에서 선택)</option>
                        {unassigned.map((p) => (
                          <option key={p.id} value={p.id}>
                            {displayName(p)}{nightsLabel(p) ? ` · ${nightsLabel(p)}` : ''} · {p.chapter}
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

export default Rooms;
