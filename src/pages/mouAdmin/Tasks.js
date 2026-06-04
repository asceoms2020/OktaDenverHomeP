import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Select, Input, PrimaryButton,
  GhostButton, Message, Empty, Table, TableWrap, MiniInput, IconButton, Badge,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchTasks, upsertTask, deleteTask, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const STATUSES = ['Not Started', 'In Progress', 'Completed'];
const STATUS_KO = { 'Not Started': '준비중', 'In Progress': '진행중', 'Completed': '완료' };
const STATUS_STYLE = {
  'Not Started': { bg: 'rgba(149,165,166,0.15)', color: '#5d6d7e' },
  'In Progress': { bg: 'rgba(52,152,219,0.14)', color: '#1f5a7a' },
  'Completed': { bg: 'rgba(46,204,113,0.14)', color: '#1f7a3b' },
};
const arr = (s) => (s || '').split(/[,，]/).map((x) => x.trim()).filter(Boolean);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [fDay, setFDay] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fWho, setFWho] = useState('');

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setTasks(await fetchTasks());
    } catch (e) {
      setMsg({ error: true, text: `업무를 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const days = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.day).filter(Boolean))).sort(),
    [tasks]
  );

  const filtered = useMemo(() => {
    const who = fWho.trim();
    return tasks.filter((t) => {
      if (fDay && t.day !== fDay) return false;
      if (fStatus && t.status !== fStatus) return false;
      if (who && !(t.responsible || []).some((r) => r.includes(who))) return false;
      return true;
    });
  }, [tasks, fDay, fStatus, fWho]);

  const save = async (task, patch) => {
    try {
      const next = { ...task, ...patch };
      setTasks((prev) => prev.map((t) => (t.id === task.id ? next : t)));
      await upsertTask(next);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addTask = async () => {
    const task = {
      id: newId(),
      day: fDay || '사전준비',
      category: '',
      task: '',
      responsible: [],
      due_date: null,
      status: 'Not Started',
      supplies: '',
      notes: '',
      sort_order: tasks.length,
    };
    try { await upsertTask(task); load(); }
    catch (e) { setMsg({ error: true, text: `업무 추가 실패: ${e.message}` }); }
  };

  const removeTask = async (id) => {
    if (!window.confirm('이 업무를 삭제할까요?')) return;
    try { await deleteTask(id); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const cycleStatus = (task) => {
    const i = STATUSES.indexOf(task.status);
    save(task, { status: STATUSES[(i + 1) % STATUSES.length] });
  };

  const exportCsv = () => {
    const csv = toCsv(filtered, [
      { label: '일자', key: 'day' },
      { label: '활동', key: 'category' },
      { label: '업무', key: 'task' },
      { label: '담당자', value: (t) => (t.responsible || []).join(' | ') },
      { label: '마감', key: 'due_date' },
      { label: '상태', value: (t) => STATUS_KO[t.status] || t.status },
      { label: '준비물', key: 'supplies' },
      { label: '비고', key: 'notes' },
    ]);
    downloadCsv('mou_tasks.csv', csv);
  };

  const done = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <Card>
      <CardHead>
        <CardTitle>업무 지시 · 전체 {tasks.length} · 완료 {done} · 표시 {filtered.length}</CardTitle>
        <span style={{ display: 'flex', gap: 8 }}>
          <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
          <PrimaryButton onClick={addTask}>+ 업무 추가</PrimaryButton>
        </span>
      </CardHead>
      <CardBody>
        <Toolbar>
          <Select value={fDay} onChange={(e) => setFDay(e.target.value)}>
            <option value="">전체 일자</option>
            {days.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="">전체 상태</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_KO[s]}</option>)}
          </Select>
          <Input placeholder="담당자 검색" value={fWho} onChange={(e) => setFWho(e.target.value)} style={{ width: 160 }} />
        </Toolbar>

        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th style={{ minWidth: 90 }}>일자</th>
                  <th style={{ minWidth: 110 }}>활동</th>
                  <th style={{ minWidth: 160 }}>업무</th>
                  <th style={{ minWidth: 150 }}>담당자</th>
                  <th style={{ minWidth: 130 }}>마감</th>
                  <th style={{ minWidth: 90 }}>상태</th>
                  <th style={{ minWidth: 140 }}>준비물</th>
                  <th style={{ minWidth: 140 }}>비고</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td><MiniInput defaultValue={t.day || ''} onBlur={(e) => save(t, { day: e.target.value })} /></td>
                    <td><MiniInput defaultValue={t.category || ''} onBlur={(e) => save(t, { category: e.target.value })} /></td>
                    <td><MiniInput defaultValue={t.task || ''} onBlur={(e) => save(t, { task: e.target.value })} /></td>
                    <td>
                      <MiniInput
                        defaultValue={(t.responsible || []).join(', ')}
                        placeholder="쉼표로 구분"
                        onBlur={(e) => save(t, { responsible: arr(e.target.value) })}
                      />
                    </td>
                    <td>
                      <MiniInput
                        type="date"
                        defaultValue={t.due_date || ''}
                        onBlur={(e) => save(t, { due_date: e.target.value || null })}
                      />
                    </td>
                    <td>
                      <Badge
                        as="button"
                        onClick={() => cycleStatus(t)}
                        style={{ cursor: 'pointer', border: 'none' }}
                        $bg={STATUS_STYLE[t.status]?.bg}
                        $color={STATUS_STYLE[t.status]?.color}
                        title="클릭하여 상태 변경"
                      >
                        {STATUS_KO[t.status] || t.status}
                      </Badge>
                    </td>
                    <td><MiniInput defaultValue={t.supplies || ''} onBlur={(e) => save(t, { supplies: e.target.value })} /></td>
                    <td><MiniInput defaultValue={t.notes || ''} onBlur={(e) => save(t, { notes: e.target.value })} /></td>
                    <td><IconButton onClick={() => removeTask(t.id)}>삭제</IconButton></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9}><Empty>업무가 없습니다. “+ 업무 추가”로 시작하세요.</Empty></td></tr>
                )}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </CardBody>
    </Card>
  );
};

export default Tasks;
