import React, { useEffect, useMemo, useState } from 'react';
import {
  StatGrid, Stat, StatLabel, StatValue, StatSub,
  Card, CardHead, CardTitle, CardBody, Badge, Table, TableWrap, Empty,
} from '../../styles/MouEventAdmin.styles';
import { parseAmount, displayName, headcount, fetchRooms, buildRoomMap } from '../../services/mouAdmin';

const Dashboard = ({ participants }) => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { fetchRooms().then(setRooms).catch(() => {}); }, []);
  const roomMap = useMemo(() => buildRoomMap(rooms), [rooms]);

  const s = useMemo(() => {
    const rows = participants.length;
    let total = 0;            // 동반자 포함 실제 인원
    const byType = {};
    let companions = 0;
    let paidCount = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;
    let checkedIn = 0;
    const golf = [];
    const train = [];
    let waiverMissing = 0;
    const roomMissing = [];
    const arrivalByDate = {};
    const departureByDate = {};

    participants.forEach((p) => {
      const head = headcount(p);
      total += head;
      byType[p.member_type || '미지정'] = (byType[p.member_type || '미지정'] || 0) + 1;
      companions += (p.companion_count || (p.has_companion ? 1 : 0));
      const amt = parseAmount(p.event_fee);
      if (p.payment_received) { paidCount += 1; paidAmount += amt; }
      else unpaidAmount += amt;
      if (p.checked_in) checkedIn += 1;
      if ((p.programs || []).includes('golf')) golf.push(p);
      if ((p.programs || []).includes('train')) train.push(p);
      if (!p.waiver_status || !/완료|done|y/i.test(p.waiver_status)) waiverMissing += 1;
      if (!roomMap[p.id]) roomMissing.push(p);
      if (p.arrival_date) arrivalByDate[p.arrival_date] = (arrivalByDate[p.arrival_date] || 0) + head;
      if (p.departure_date) departureByDate[p.departure_date] = (departureByDate[p.departure_date] || 0) + head;
    });

    return {
      rows, total, byType, companions, paidCount, paidAmount, unpaidAmount,
      unpaidCount: rows - paidCount, checkedIn, golf, train, waiverMissing, roomMissing,
      arrivalByDate, departureByDate,
    };
  }, [participants, roomMap]);

  const fmt = (n) => `$${n.toLocaleString()}`;
  const dateRows = (obj) =>
    Object.keys(obj).sort().map((d) => ({ date: d, count: obj[d] }));

  return (
    <div>
      <StatGrid>
        <Stat $accent="#2ecc71">
          <StatLabel>총 인원 (동반자 포함)</StatLabel>
          <StatValue>{s.total}명</StatValue>
          <StatSub>명단 {s.rows}건 + 동반자 {s.companions}명</StatSub>
        </Stat>
        <Stat $accent="#16a085">
          <StatLabel>체크인 완료</StatLabel>
          <StatValue>{s.checkedIn}명</StatValue>
          <StatSub>미체크 {s.rows - s.checkedIn}명</StatSub>
        </Stat>
        <Stat $accent="#27ae60">
          <StatLabel>납부 완료</StatLabel>
          <StatValue>{s.paidCount}명</StatValue>
          <StatSub>{fmt(s.paidAmount)} 수금</StatSub>
        </Stat>
        <Stat $accent="#e74c3c">
          <StatLabel>미납</StatLabel>
          <StatValue>{s.unpaidCount}명</StatValue>
          <StatSub>{fmt(s.unpaidAmount)} 미수</StatSub>
        </Stat>
        <Stat $accent="#3498db">
          <StatLabel>골프 신청</StatLabel>
          <StatValue>{s.golf.length}명</StatValue>
          <StatSub>팀 편성 필요</StatSub>
        </Stat>
        <Stat $accent="#9b59b6">
          <StatLabel>기차(Pikes Peak)</StatLabel>
          <StatValue>{s.train.length}명</StatValue>
          <StatSub>차량 배정 필요</StatSub>
        </Stat>
        <Stat $accent="#f39c12">
          <StatLabel>Waiver 미완료</StatLabel>
          <StatValue>{s.waiverMissing}명</StatValue>
          <StatSub>서명 확인 필요</StatSub>
        </Stat>
        <Stat $accent="#e67e22">
          <StatLabel>방 미배정</StatLabel>
          <StatValue>{s.roomMissing.length}명</StatValue>
          <StatSub>Room # 없음</StatSub>
        </Stat>
      </StatGrid>

      <Card>
        <CardHead><CardTitle>카테고리별 인원</CardTitle></CardHead>
        <CardBody>
          {Object.keys(s.byType).length === 0 ? (
            <Empty>데이터가 없습니다. 시드(mou_seed.sql)를 실행했는지 확인하세요.</Empty>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(s.byType).map(([k, v]) => (
                <Badge key={k} $bg="rgba(46,204,113,0.12)" $color="#1f7a3b">
                  {k} {v}명
                </Badge>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card>
          <CardHead><CardTitle>입국 날짜별 인원</CardTitle></CardHead>
          <CardBody>
            <TableWrap>
              <Table>
                <thead><tr><th>입국일</th><th>인원</th></tr></thead>
                <tbody>
                  {dateRows(s.arrivalByDate).map((r) => (
                    <tr key={r.date}><td>{r.date}</td><td>{r.count}명</td></tr>
                  ))}
                  {dateRows(s.arrivalByDate).length === 0 && (
                    <tr><td colSpan={2}><Empty>정보 없음</Empty></td></tr>
                  )}
                </tbody>
              </Table>
            </TableWrap>
          </CardBody>
        </Card>
        <Card>
          <CardHead><CardTitle>출국 날짜별 인원</CardTitle></CardHead>
          <CardBody>
            <TableWrap>
              <Table>
                <thead><tr><th>출국일</th><th>인원</th></tr></thead>
                <tbody>
                  {dateRows(s.departureByDate).map((r) => (
                    <tr key={r.date}><td>{r.date}</td><td>{r.count}명</td></tr>
                  ))}
                  {dateRows(s.departureByDate).length === 0 && (
                    <tr><td colSpan={2}><Empty>정보 없음</Empty></td></tr>
                  )}
                </tbody>
              </Table>
            </TableWrap>
          </CardBody>
        </Card>
      </div>

      {s.roomMissing.length > 0 && (
        <Card>
          <CardHead><CardTitle>⚠️ 방 미배정 명단 ({s.roomMissing.length}명)</CardTitle></CardHead>
          <CardBody>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {s.roomMissing.map((p) => (
                <Badge key={p.id} $bg="rgba(230,126,34,0.12)" $color="#b9530a">
                  {displayName(p)}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
