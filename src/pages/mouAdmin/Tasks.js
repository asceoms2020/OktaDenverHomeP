import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, Select, Input, PrimaryButton,
  GhostButton, Message, Empty, Table, TableWrap, MiniInput, IconButton, Badge,
  ProgressWrap, ProgressBar, ProgressSeg, GroupHeaderRow, Chip, ChipRow,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchTasks, upsertTask, updateTask, deleteTask, fetchStaff, STAFF_GROUPS, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const DAY_OPTIONS = ['사전준비(6/24)', 'Day1(6/25)', 'Day2(6/26)', 'Day3(6/27)', 'Day4(6/28)', '공통'];
const STATUSES = ['Not Started', 'In Progress', 'Completed'];
const STATUS_KO = { 'Not Started': '준비중', 'In Progress': '진행중', 'Completed': '완료' };
const STATUS_STYLE = {
  'Not Started': { bg: 'rgba(149,165,166,0.15)', color: '#5d6d7e', bar: '#b0b9c1' },
  'In Progress': { bg: 'rgba(52,152,219,0.14)', color: '#1f5a7a', bar: '#3498db' },
  'Completed': { bg: 'rgba(46,204,113,0.14)', color: '#1f7a3b', bar: '#2ecc71' },
};
const dayOrder = (d) => { const i = DAY_OPTIONS.indexOf(d); return i === -1 ? 99 : i; };

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [fDay, setFDay] = useState('');
  const [fCat, setFCat] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fWho, setFWho] = useState('');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [staff, setStaff] = useState([]);

  useEffect(() => { fetchStaff().then(setStaff).catch(() => {}); }, []);

  // 담당자 후보를 그룹별로 정리
  const staffByGroup = useMemo(() => {
    const g = {};
    STAFF_GROUPS.forEach((k) => { g[k] = []; });
    staff.forEach((s) => { (g[s.role_group] = g[s.role_group] || []).push(s); });
    return g;
  }, [staff]);

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
    () => Array.from(new Set([...DAY_OPTIONS, ...tasks.map((t) => t.day).filter(Boolean)])),
    [tasks]
  );
  const categories = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.category).filter(Boolean))).sort(),
    [tasks]
  );

  const filtered = useMemo(() => {
    const who = fWho.trim();
    return tasks.filter((t) => {
      if (fDay && t.day !== fDay) return false;
      if (fCat && t.category !== fCat) return false;
      if (fStatus && t.status !== fStatus) return false;
      if (who && !(t.responsible || []).some((r) => r.includes(who))) return false;
      return true;
    });
  }, [tasks, fDay, fCat, fStatus, fWho]);

  // 일자 → 활동 그룹으로 묶기
  const groups = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      if (a.day !== b.day) return dayOrder(a.day) - dayOrder(b.day) || (a.day || '').localeCompare(b.day || '');
      if ((a.category || '') !== (b.category || '')) return (a.category || '').localeCompare(b.category || '', 'ko');
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
    const map = new Map();
    for (const t of sorted) {
      const key = `${t.day || '-'}|||${t.category || '(미분류)'}`;
      if (!map.has(key)) map.set(key, { key, day: t.day || '-', category: t.category || '(미분류)', items: [] });
      map.get(key).items.push(t);
    }
    return Array.from(map.values());
  }, [filtered]);

  const summary = useMemo(() => {
    const c = { 'Not Started': 0, 'In Progress': 0, 'Completed': 0 };
    filtered.forEach((t) => { c[t.status] = (c[t.status] || 0) + 1; });
    const total = filtered.length || 1;
    return { c, total: filtered.length, pct: (k) => (c[k] / total) * 100 };
  }, [filtered]);

  const toggleCollapse = (key) => {
    setCollapsed((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  };

  const save = async (task, patch) => {
    try {
      const next = { ...task, ...patch };
      setTasks((prev) => prev.map((t) => (t.id === task.id ? next : t)));
      await updateTask(task.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addTask = async () => {
    const task = {
      id: newId(),
      day: fDay || DAY_OPTIONS[0],
      category: fCat || '',
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

  const addResp = (task, name) => {
    if (!name) return;
    const cur = task.responsible || [];
    if (cur.includes(name)) return;
    save(task, { responsible: [...cur, name] });
  };
  const removeResp = (task, name) => {
    save(task, { responsible: (task.responsible || []).filter((x) => x !== name) });
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

  return (
    <Card>
      <CardHead>
        <CardTitle>
          업무 지시 · 전체 {tasks.length} · 완료 {tasks.filter((t) => t.status === 'Completed').length}
        </CardTitle>
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
          <Select value={fCat} onChange={(e) => setFCat(e.target.value)}>
            <option value="">전체 활동</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="">전체 상태</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_KO[s]}</option>)}
          </Select>
          <Input placeholder="담당자 검색" value={fWho} onChange={(e) => setFWho(e.target.value)} style={{ width: 160 }} />
        </Toolbar>

        {/* 진행 요약 */}
        <ProgressWrap>
          <ProgressBar title={`완료 ${summary.c.Completed} / 진행 ${summary.c['In Progress']} / 준비 ${summary.c['Not Started']}`}>
            <ProgressSeg $pct={summary.pct('Completed')} $color={STATUS_STYLE.Completed.bar} />
            <ProgressSeg $pct={summary.pct('In Progress')} $color={STATUS_STYLE['In Progress'].bar} />
            <ProgressSeg $pct={summary.pct('Not Started')} $color={STATUS_STYLE['Not Started'].bar} />
          </ProgressBar>
          <span style={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'nowrap' }}>
            완료 <b style={{ color: '#1f7a3b' }}>{summary.c.Completed}</b> ·
            진행 <b style={{ color: '#1f5a7a' }}>{summary.c['In Progress']}</b> ·
            준비 <b style={{ color: '#5d6d7e' }}>{summary.c['Not Started']}</b>
            {summary.total > 0 && <> · {Math.round(summary.pct('Completed'))}%</>}
          </span>
        </ProgressWrap>

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
                  <th style={{ minWidth: 300 }}>담당자</th>
                  <th style={{ minWidth: 130 }}>마감</th>
                  <th style={{ minWidth: 90 }}>상태</th>
                  <th style={{ minWidth: 140 }}>준비물</th>
                  <th style={{ minWidth: 140 }}>비고</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => {
                  const total = g.items.length;
                  const done = g.items.filter((t) => t.status === 'Completed').length;
                  const isCollapsed = collapsed.has(g.key);
                  const allDone = done === total && total > 0;
                  return (
                    <React.Fragment key={g.key}>
                      <GroupHeaderRow onClick={() => toggleCollapse(g.key)}>
                        <td colSpan={9}>
                          <span style={{ marginRight: 6 }}>{isCollapsed ? '▸' : '▾'}</span>
                          {g.day} · {g.category}
                          <Badge
                            style={{ marginLeft: 10 }}
                            $bg={allDone ? 'rgba(46,204,113,0.16)' : 'rgba(52,152,219,0.12)'}
                            $color={allDone ? '#1f7a3b' : '#1f5a7a'}
                          >
                            {done}/{total} 완료
                          </Badge>
                        </td>
                      </GroupHeaderRow>
                      {!isCollapsed && g.items.map((t) => (
                        <tr key={t.id}>
                          <td>
                            <Select
                              value={t.day || ''}
                              onChange={(e) => save(t, { day: e.target.value })}
                              style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                            >
                              {!DAY_OPTIONS.includes(t.day) && t.day && <option value={t.day}>{t.day}</option>}
                              {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </Select>
                          </td>
                          <td><MiniInput defaultValue={t.category || ''} onBlur={(e) => save(t, { category: e.target.value })} /></td>
                          <td><MiniInput defaultValue={t.task || ''} onBlur={(e) => save(t, { task: e.target.value })} /></td>
                          <td style={{ whiteSpace: 'normal', minWidth: 260 }}>
                            <ChipRow style={{ marginBottom: 6 }}>
                              {(t.responsible || []).map((name) => (
                                <Chip key={name}>
                                  {name}
                                  <button onClick={() => removeResp(t, name)} title="제거">✕</button>
                                </Chip>
                              ))}
                              {(t.responsible || []).length === 0 && (
                                <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>담당자 없음</span>
                              )}
                            </ChipRow>
                            <Select
                              value=""
                              onChange={(e) => { addResp(t, e.target.value); e.target.value = ''; }}
                              style={{ padding: '6px 8px', fontSize: '0.85rem', width: '100%' }}
                            >
                              <option value="">+ 담당자 추가</option>
                              {STAFF_GROUPS.map((grp) => (
                                (staffByGroup[grp] || []).length > 0 && (
                                  <optgroup key={grp} label={grp}>
                                    {staffByGroup[grp].map((s) => (
                                      <option key={s.id} value={s.name}>
                                        {s.name}{s.title ? ` (${s.title})` : ''}
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                              ))}
                            </Select>
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
                    </React.Fragment>
                  );
                })}
                {groups.length === 0 && (
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
