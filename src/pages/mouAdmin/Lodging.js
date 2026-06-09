import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Input, Select,
  Table, TableWrap, Badge, CheckButton, GhostButton, Empty, Message,
  StatGrid, Stat, StatLabel, StatValue, StatSub,
} from '../../styles/MouEventAdmin.styles';
import {
  setLodgingPaid, nightsBetween, payableNights, displayName,
  fetchRooms, buildRoomTypeMap, buildRoomMap, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const fmtChecked = (who, at) => {
  if (!who && !at) return null;
  const when = at
    ? new Date(at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
    : '';
  return `${who || '관리자'}${when ? ` · ${when}` : ''}`;
};

const Lodging = ({ participants, adminName, reload }) => {
  const [q, setQ] = useState('');
  const [view, setView] = useState('payable'); // payable | all
  const [pay, setPay] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [rooms, setRooms] = useState([]);

  // 방 배정(occupant_ids) → 객실타입 매핑 (단일 기준)
  useEffect(() => { fetchRooms().then(setRooms).catch(() => {}); }, []);
  const roomTypeMap = useMemo(() => buildRoomTypeMap(rooms), [rooms]);
  const roomNoMap = useMemo(() => buildRoomMap(rooms), [rooms]);

  // 박수 계산. 차세대봉사자(봉사단)는 리스트엔 나오되 숙박비 면제 → 받을 박수 0, 객실은 2인실 고정
  const rows = useMemo(() => {
    return participants.map((p) => {
      const total = nightsBetween(p.arrival_date, p.departure_date);
      const exempt = p.member_type === '차세대봉사자';
      const roomType = exempt ? '2인실' : (roomTypeMap[p.id] || null);
      return { ...p, _total: total, _exempt: exempt, _roomType: roomType, _roomNo: roomNoMap[p.id] || null, _payable: exempt ? 0 : payableNights(total) };
    }).filter((p) => p._roomNo); // 방 배정 안 된 사람은 숙박 정산에서 제외
  }, [participants, roomTypeMap, roomNoMap]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((p) => {
      // 추가요금 대상 보기: 받을 박수>0 + 봉사단(면제)은 항상 노출
      if (view === 'payable' && !(p._payable > 0) && !p._exempt) return false;
      if (needle) {
        const hay = `${p.name_ko} ${p.name_en} ${p.chapter}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      // 납부 필터는 추가요금 대상(payable>0)에만 적용 → 면제자는 paid/unpaid에서 제외
      if (pay === 'paid' && !(p.lodging_paid && p._payable > 0)) return false;
      if (pay === 'unpaid' && !(!p.lodging_paid && p._payable > 0)) return false;
      return true;
    }).sort((a, b) => {
      const da = a.arrival_date || '9999-99-99';
      const db = b.arrival_date || '9999-99-99';
      if (da !== db) return da < db ? -1 : 1;
      return String(a.name_ko || '').localeCompare(String(b.name_ko || ''), 'ko');
    });
  }, [rows, q, view, pay]);

  const summary = useMemo(() => {
    const targets = rows.filter((p) => p._payable > 0);
    const payableSum = targets.reduce((s, p) => s + p._payable, 0);
    const paidTargets = targets.filter((p) => p.lodging_paid);
    const paidNights = paidTargets.reduce((s, p) => s + p._payable, 0);
    return {
      targetCount: targets.length,
      payableSum,
      paidCount: paidTargets.length,
      unpaidNights: payableSum - paidNights,
    };
  }, [rows]);

  const togglePaid = async (p) => {
    const next = !p.lodging_paid;
    const ok = window.confirm(
      next
        ? `${displayName(p)} 님의 추가 숙박비(${p._payable}박)를 '납부완료'로 체크할까요?\n(체크한 사람: ${adminName})`
        : `${displayName(p)} 님의 추가 숙박비 '납부완료'를 취소할까요?`
    );
    if (!ok) return;
    setBusyId(p.id); setMsg(null);
    try { await setLodgingPaid(p, next, adminName); await reload(); }
    catch (e) { setMsg({ error: true, text: `저장 실패: ${e.message}` }); }
    finally { setBusyId(null); }
  };

  const exportCsv = () => {
    const csv = toCsv(filtered, [
      { label: '이름', key: 'name_ko' },
      { label: '영어이름', key: 'name_en' },
      { label: '체크인', key: 'arrival_date' },
      { label: '체크아웃', key: 'departure_date' },
      { label: '방번호', value: (r) => r._roomNo || '' },
      { label: '객실', value: (r) => r._roomType || '' },
      { label: '총 박수', value: (r) => (r._total == null ? '' : r._total) },
      { label: '받을 박수', value: (r) => (r._exempt ? '면제' : r._payable == null ? '' : r._payable) },
      { label: '납부', value: (r) => (r._exempt ? '면제' : !(r._payable > 0) ? '해당없음' : r.lodging_paid ? '완료' : '미납') },
      { label: '체크한사람', key: 'lodging_paid_by' },
    ]);
    downloadCsv('mou_lodging.csv', csv);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>숙박 정산 · 추가요금 대상 {summary.targetCount}명 (3박부터 추가)</CardTitle>
        <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
      </CardHead>
      <CardBody>
        <StatGrid>
          <Stat $accent="#3498db">
            <StatLabel>추가요금 대상</StatLabel>
            <StatValue>{summary.targetCount}명</StatValue>
            <StatSub>총 {summary.payableSum}박 청구</StatSub>
          </Stat>
          <Stat $accent="#2ecc71">
            <StatLabel>납부 완료</StatLabel>
            <StatValue>{summary.paidCount}명</StatValue>
          </Stat>
          <Stat $accent="#e74c3c">
            <StatLabel>미납 박수</StatLabel>
            <StatValue>{summary.unpaidNights}박</StatValue>
            <StatSub>아직 받을 추가 숙박비</StatSub>
          </Stat>
        </StatGrid>

        <Toolbar>
          <Input placeholder="이름·지회 검색" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="payable">추가요금 대상만 (3박+)</option>
            <option value="all">전체 참가자</option>
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
                <th>영어이름</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th>방번호</th>
                <th>객실</th>
                <th>총 박수</th>
                <th>받을 박수</th>
                <th>납부 여부</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name_ko || '-'}</strong></td>
                  <td>{p.name_en || '-'}</td>
                  <td>{p.arrival_date || <span style={{ color: '#cbd5e1' }}>미정</span>}</td>
                  <td>{p.departure_date || <span style={{ color: '#cbd5e1' }}>미정</span>}</td>
                  <td>
                    {p._roomNo
                      ? <Badge $bg="rgba(52,152,219,0.12)" $color="#1f5a7a">{p._roomNo}</Badge>
                      : <span style={{ color: '#cbd5e1' }}>미배정</span>}
                  </td>
                  <td>
                    {p._roomType
                      ? <Badge $bg={p._roomType === '1인실' ? 'rgba(155,89,182,0.12)' : 'rgba(46,204,113,0.12)'} $color={p._roomType === '1인실' ? '#7d3c98' : '#1f7a3b'}>{p._roomType}</Badge>
                      : <span style={{ color: '#cbd5e1' }}>미배정</span>}
                  </td>
                  <td>{p._total == null ? <span style={{ color: '#cbd5e1' }}>-</span> : `${p._total}박`}</td>
                  <td>
                    {p._exempt
                      ? <Badge $bg="rgba(52,152,219,0.12)" $color="#1f5a7a">면제(봉사단)</Badge>
                      : p._payable == null
                        ? <span style={{ color: '#cbd5e1' }}>-</span>
                        : p._payable > 0
                          ? <Badge $bg="rgba(231,76,60,0.12)" $color="#c0392b">{p._payable}박</Badge>
                          : <Badge $bg="rgba(149,165,166,0.15)" $color="#5d6d7e">0박</Badge>}
                  </td>
                  <td>
                    {p._exempt ? (
                      <span style={{ color: '#1f5a7a', fontSize: '0.82rem' }}>면제</span>
                    ) : p._payable > 0 ? (
                      <>
                        <CheckButton $on={p.lodging_paid} disabled={busyId === p.id} onClick={() => togglePaid(p)}>
                          {p.lodging_paid ? '✓ 납부완료' : '미납'}
                        </CheckButton>
                        {p.lodging_paid && (
                          <div style={{ fontSize: '0.72rem', color: '#1f7a3b', marginTop: 3 }}>
                            {fmtChecked(p.lodging_paid_by, p.lodging_paid_at)}
                          </div>
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>해당 없음</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9}><Empty>조건에 맞는 참가자가 없습니다.</Empty></td></tr>
              )}
            </tbody>
          </Table>
        </TableWrap>
      </CardBody>
    </Card>
  );
};

export default Lodging;
