import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Select, Input, PrimaryButton,
  GhostButton, Message, Empty, Table, TableWrap, MiniInput, IconButton,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchSchedule, upsertSchedule, updateScheduleRow, deleteScheduleRow, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const DEFAULT_DAYS = ['사전준비(6/24)', 'Day1(6/25)', 'Day2(6/26)', 'Day3(6/27)', 'Day4(6/28)'];

const Schedule = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [day, setDay] = useState('Day1(6/25)');
  const [newDay, setNewDay] = useState('');

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setRows(await fetchSchedule());
    } catch (e) {
      setMsg({ error: true, text: `일정을 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const days = useMemo(() => {
    const set = new Set([...DEFAULT_DAYS, ...rows.map((r) => r.day).filter(Boolean)]);
    return Array.from(set);
  }, [rows]);

  const dayRows = useMemo(
    () => rows.filter((r) => r.day === day).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [rows, day]
  );

  const save = async (row, patch) => {
    try {
      const next = { ...row, ...patch };
      setRows((prev) => prev.map((r) => (r.id === row.id ? next : r)));
      await updateScheduleRow(row.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addRow = async () => {
    const maxOrder = dayRows.reduce((m, r) => Math.max(m, r.sort_order || 0), 0);
    const row = {
      id: newId(), day, time_start: '', time_end: '',
      title: '', detail: '', responsible: '', note: '', sort_order: maxOrder + 1,
    };
    try { await upsertSchedule(row); load(); }
    catch (e) { setMsg({ error: true, text: `행 추가 실패: ${e.message}` }); }
  };

  const removeRow = async (id) => {
    if (!window.confirm('이 일정 행을 삭제할까요?')) return;
    try { await deleteScheduleRow(id); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const addDay = () => {
    const d = newDay.trim();
    if (!d) return;
    setDay(d);
    setNewDay('');
  };

  const exportCsv = () => {
    const csv = toCsv(dayRows, [
      { label: '일자', key: 'day' },
      { label: '시작', key: 'time_start' },
      { label: '종료', key: 'time_end' },
      { label: '진행 내용', key: 'title' },
      { label: '세부 사항', key: 'detail' },
      { label: '담당', key: 'responsible' },
      { label: '비고', key: 'note' },
    ]);
    downloadCsv(`mou_schedule_${day}.csv`, csv);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>일정표 · {day} ({dayRows.length}개 항목)</CardTitle>
        <span style={{ display: 'flex', gap: 8 }}>
          <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
          <PrimaryButton onClick={addRow}>+ 일정 추가</PrimaryButton>
        </span>
      </CardHead>
      <CardBody>
        <Toolbar>
          <Select value={day} onChange={(e) => setDay(e.target.value)}>
            {days.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input placeholder="새 일자 추가 (예: 골프데이)" value={newDay} onChange={(e) => setNewDay(e.target.value)} style={{ width: 200 }} />
          <GhostButton onClick={addDay}>+ 일자</GhostButton>
        </Toolbar>

        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th style={{ minWidth: 80 }}>시작</th>
                  <th style={{ minWidth: 80 }}>종료</th>
                  <th style={{ minWidth: 160 }}>진행 내용</th>
                  <th style={{ minWidth: 200 }}>세부 사항</th>
                  <th style={{ minWidth: 120 }}>담당</th>
                  <th style={{ minWidth: 120 }}>비고</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dayRows.map((r) => (
                  <tr key={r.id}>
                    <td><MiniInput defaultValue={r.time_start || ''} placeholder="10:00" onBlur={(e) => save(r, { time_start: e.target.value })} /></td>
                    <td><MiniInput defaultValue={r.time_end || ''} placeholder="12:30" onBlur={(e) => save(r, { time_end: e.target.value })} /></td>
                    <td><MiniInput defaultValue={r.title || ''} onBlur={(e) => save(r, { title: e.target.value })} /></td>
                    <td><MiniInput defaultValue={r.detail || ''} onBlur={(e) => save(r, { detail: e.target.value })} /></td>
                    <td><MiniInput defaultValue={r.responsible || ''} onBlur={(e) => save(r, { responsible: e.target.value })} /></td>
                    <td><MiniInput defaultValue={r.note || ''} onBlur={(e) => save(r, { note: e.target.value })} /></td>
                    <td><IconButton onClick={() => removeRow(r.id)}>삭제</IconButton></td>
                  </tr>
                ))}
                {dayRows.length === 0 && (
                  <tr><td colSpan={7}><Empty>이 일자에 일정이 없습니다. “+ 일정 추가”로 시작하세요.</Empty></td></tr>
                )}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </CardBody>
    </Card>
  );
};

export default Schedule;
