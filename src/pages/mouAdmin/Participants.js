import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Input, Select,
  Table, TableWrap, Badge, CheckButton, GhostButton, PrimaryButton,
  Empty, Message, IconButton,
} from '../../styles/MouEventAdmin.styles';
import {
  setPaymentReceived, setCheckedIn, deleteParticipant, PROGRAM_LABELS,
  displayName, headcount, fetchRooms, buildRoomMap, toCsv, downloadCsv,
} from '../../services/mouAdmin';
import ParticipantEditModal from './ParticipantEditModal';

const fmtChecked = (who, at) => {
  if (!who && !at) return null;
  const when = at
    ? new Date(at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
    : '';
  return `${who || '관리자'}${when ? ` · ${when}` : ''}`;
};

const Participants = ({ participants, adminName, reload }) => {
  const [q, setQ] = useState('');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState('');
  const [program, setProgram] = useState('');
  const [pay, setPay] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(null); // participant | 'new' | null
  const [rooms, setRooms] = useState([]);

  // 방 배정(occupant_ids)을 단일 기준으로 Room# 파생
  useEffect(() => {
    fetchRooms().then(setRooms).catch(() => {});
  }, []);
  const roomMap = useMemo(() => buildRoomMap(rooms), [rooms]);

  const chapters = useMemo(
    () => Array.from(new Set(participants.map((p) => p.chapter).filter(Boolean))).sort(),
    [participants]
  );
  const types = useMemo(
    () => Array.from(new Set(participants.map((p) => p.member_type).filter(Boolean))).sort(),
    [participants]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return participants.filter((p) => {
      if (needle) {
        const hay = `${p.name_ko} ${p.name_en} ${p.chapter} ${p.companion_name || ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (chapter && p.chapter !== chapter) return false;
      if (type && p.member_type !== type) return false;
      if (program && !(p.programs || []).includes(program)) return false;
      if (pay === 'paid' && !p.payment_received) return false;
      if (pay === 'unpaid' && p.payment_received) return false;
      return true;
    });
  }, [participants, q, chapter, type, program, pay]);

  const totalHead = useMemo(
    () => filtered.reduce((s, p) => s + headcount(p), 0),
    [filtered]
  );

  const togglePay = async (p) => {
    setBusyId(p.id); setMsg(null);
    try { await setPaymentReceived(p, !p.payment_received, adminName); await reload(); }
    catch (e) { setMsg({ error: true, text: `납부 상태 저장 실패: ${e.message}` }); }
    finally { setBusyId(null); }
  };

  const toggleCheckin = async (p) => {
    setBusyId(p.id); setMsg(null);
    try { await setCheckedIn(p, !p.checked_in, adminName); await reload(); }
    catch (e) { setMsg({ error: true, text: `체크인 저장 실패: ${e.message}` }); }
    finally { setBusyId(null); }
  };

  const remove = async (p) => {
    if (!window.confirm(`${displayName(p)} 님을 명단에서 삭제할까요?`)) return;
    setBusyId(p.id); setMsg(null);
    try { await deleteParticipant(p.id); await reload(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
    finally { setBusyId(null); }
  };

  const exportCsv = () => {
    const csv = toCsv(filtered, [
      { label: '이름(한)', key: 'name_ko' },
      { label: '이름(영)', key: 'name_en' },
      { label: '지회', key: 'chapter' },
      { label: '구분', key: 'member_type' },
      { label: '동반자수', key: 'companion_count' },
      { label: '입국', key: 'arrival_date' },
      { label: '출국', key: 'departure_date' },
      { label: '룸타입', key: 'room_type' },
      { label: 'Room#', value: (r) => roomMap[r.id] || '' },
      { label: '프로그램', value: (r) => (r.programs || []).map((x) => PROGRAM_LABELS[x] || x).join(' | ') },
      { label: '행사비', key: 'event_fee' },
      { label: '납부', value: (r) => (r.payment_received ? '완료' : '미납') },
      { label: '납부체크', key: 'payment_checked_by' },
      { label: '체크인', value: (r) => (r.checked_in ? '완료' : '미체크') },
      { label: '체크인담당', key: 'checked_in_by' },
    ]);
    downloadCsv('mou_participants.csv', csv);
  };

  return (
    <>
      <Card>
        <CardHead>
          <CardTitle>
            참가자 명단 · {filtered.length}명 (동반자 포함 {totalHead}명) / 전체 {participants.length}
          </CardTitle>
          <span style={{ display: 'flex', gap: 8 }}>
            <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
            <PrimaryButton onClick={() => setEditing('new')}>+ 참가자 추가</PrimaryButton>
          </span>
        </CardHead>
        <CardBody>
          <Toolbar>
            <Input placeholder="이름·지회 검색" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={chapter} onChange={(e) => setChapter(e.target.value)}>
              <option value="">전체 지회</option>
              {chapters.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">전체 구분</option>
              {types.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={program} onChange={(e) => setProgram(e.target.value)}>
              <option value="">전체 프로그램</option>
              {Object.entries(PROGRAM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Select value={pay} onChange={(e) => setPay(e.target.value)}>
              <option value="">전체 납부</option>
              <option value="paid">납부완료</option>
              <option value="unpaid">미납</option>
            </Select>
          </Toolbar>

          {msg && <Message $error={msg.error}>{msg.text}</Message>}

          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>지회</th>
                  <th>구분</th>
                  <th>입국</th>
                  <th>출국</th>
                  <th>Room#</th>
                  <th>프로그램</th>
                  <th>행사비</th>
                  <th>납부 체크</th>
                  <th>체크인</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{displayName(p)}</strong>
                      {(p.companion_count > 0 || p.has_companion) && (
                        <div style={{ fontSize: '0.78rem', color: '#9b59b6' }}>
                          +동반 {p.companion_count || 1}명{p.companion_name ? ` (${p.companion_name})` : ''}
                        </div>
                      )}
                    </td>
                    <td>{p.chapter || '-'}</td>
                    <td><Badge>{p.member_type || '-'}</Badge></td>
                    <td>{p.arrival_date || '-'}{p.arrival_time ? ` ${p.arrival_time}` : ''}</td>
                    <td>{p.departure_date || '-'}{p.departure_time ? ` ${p.departure_time}` : ''}</td>
                    <td title="방 배정 탭에서 변경됩니다">
                      {roomMap[p.id]
                        ? <Badge $bg="rgba(52,152,219,0.12)" $color="#1f5a7a">{roomMap[p.id]}</Badge>
                        : <span style={{ color: '#cbd5e1' }}>미배정</span>}
                    </td>
                    <td style={{ whiteSpace: 'normal', minWidth: 140 }}>
                      {(p.programs || []).map((x) => (
                        <Badge key={x} $bg="rgba(155,89,182,0.12)" $color="#7d3c98" style={{ marginRight: 4 }}>
                          {PROGRAM_LABELS[x] || x}
                        </Badge>
                      ))}
                    </td>
                    <td>{p.event_fee || '-'}</td>
                    <td>
                      <CheckButton $on={p.payment_received} disabled={busyId === p.id} onClick={() => togglePay(p)}>
                        {p.payment_received ? '✓ 납부완료' : '미납'}
                      </CheckButton>
                      {p.payment_received && (
                        <div style={{ fontSize: '0.72rem', color: '#1f7a3b', marginTop: 3 }}>
                          {fmtChecked(p.payment_checked_by, p.payment_checked_at)}
                        </div>
                      )}
                    </td>
                    <td>
                      <CheckButton $on={p.checked_in} disabled={busyId === p.id} onClick={() => toggleCheckin(p)}>
                        {p.checked_in ? '✓ 체크인' : '미체크'}
                      </CheckButton>
                      {p.checked_in && (
                        <div style={{ fontSize: '0.72rem', color: '#1f7a3b', marginTop: 3 }}>
                          {fmtChecked(p.checked_in_by, p.checked_in_at)}
                        </div>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <GhostButton onClick={() => setEditing(p)} style={{ padding: '5px 10px', marginRight: 4 }}>수정</GhostButton>
                      <IconButton onClick={() => remove(p)} disabled={busyId === p.id}>삭제</IconButton>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={11}><Empty>조건에 맞는 참가자가 없습니다.</Empty></td></tr>
                )}
              </tbody>
            </Table>
          </TableWrap>
        </CardBody>
      </Card>

      {editing && (
        <ParticipantEditModal
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={reload}
        />
      )}
    </>
  );
};

export default Participants;
