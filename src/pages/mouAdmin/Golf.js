import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card, CardHead, CardTitle, CardBody, Toolbar, PrimaryButton, GhostButton,
  Message, Empty, AssignGrid, AssignCard, AssignCardHead, AssignCardTitle,
  CapTag, Chip, ChipRow, Pool, Select, IconButton, Badge, MiniInput,
} from '../../styles/MouEventAdmin.styles';
import {
  fetchGolfTeams, upsertGolfTeam, updateGolfTeam, deleteGolfTeam, displayName, headcount, memberBadgeStyle,
  companionNames, companionLabel, toCsv, downloadCsv,
} from '../../services/mouAdmin';

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const TEAM_CAP = 4; // 골프 포섬

const Golf = ({ participants }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const golfers = useMemo(
    () => participants.filter((p) => (p.programs || []).includes('golf')),
    [participants]
  );
  // 배정 가능 풀 = 골프 신청자 + 준비위원회(프로그램 무관 배정 허용)
  const eligible = useMemo(() => {
    const seen = new Set();
    return participants.filter((p) => {
      const ok = (p.programs || []).includes('golf') || p.member_type === '준비위원회';
      if (ok && !seen.has(p.id)) { seen.add(p.id); return true; }
      return false;
    });
  }, [participants]);
  const golfCompanions = useMemo(
    () => golfers.reduce((s, p) => s + (p.companion_count || (p.has_companion ? 1 : 0)), 0),
    [golfers]
  );
  const pMap = useMemo(() => {
    const m = {};
    participants.forEach((p) => { m[p.id] = p; });
    return m;
  }, [participants]);

  const load = useCallback(async () => {
    try {
      setMsg(null);
      setTeams(await fetchGolfTeams());
    } catch (e) {
      setMsg({ error: true, text: `골프 팀을 불러오지 못했습니다: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const assignedIds = useMemo(() => {
    const s = new Set();
    teams.forEach((t) => (t.member_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [teams]);

  const unassigned = useMemo(
    () => eligible.filter((p) => !assignedIds.has(p.id)),
    [eligible, assignedIds]
  );

  // 동반자 포함 인원(좌석) 계산
  const seatsOf = (ids) => (ids || []).reduce((s, id) => s + headcount(pMap[id]), 0);
  const unassignedHead = useMemo(() => unassigned.reduce((s, p) => s + headcount(p), 0), [unassigned]);
  const compOf = (p) => (p?.companion_count || (p?.has_companion ? 1 : 0));

  const save = async (team, patch) => {
    try {
      const next = { ...team, ...patch };
      setTeams((prev) => prev.map((t) => (t.id === team.id ? next : t)));
      await updateGolfTeam(team.id, patch);
    } catch (e) {
      setMsg({ error: true, text: `저장 실패: ${e.message}` });
      load();
    }
  };

  const addTeam = async () => {
    const team = {
      id: newId(),
      team_no: teams.length + 1,
      team_name: `${teams.length + 1}조`,
      tee_info: '',
      member_ids: [],
    };
    try { await upsertGolfTeam(team); load(); }
    catch (e) { setMsg({ error: true, text: `팀 생성 실패: ${e.message}` }); }
  };

  const removeTeam = async (id) => {
    if (!window.confirm('이 팀을 삭제할까요?')) return;
    try { await deleteGolfTeam(id); load(); }
    catch (e) { setMsg({ error: true, text: `삭제 실패: ${e.message}` }); }
  };

  const addMember = (team, pid) => { if (pid) save(team, { member_ids: [...(team.member_ids || []), pid] }); };
  const removeMember = (team, pid) => save(team, { member_ids: (team.member_ids || []).filter((x) => x !== pid) });

  // 기타(외부) 골퍼 직접 입력
  const addExtra = (team, name) => {
    const nm = (name || '').trim();
    if (!nm) return;
    if ((team.extra_members || []).includes(nm)) return;
    save(team, { extra_members: [...(team.extra_members || []), nm] });
  };
  const removeExtra = (team, nm) => save(team, { extra_members: (team.extra_members || []).filter((x) => x !== nm) });

  const exportCsv = () => {
    const csv = toCsv(teams, [
      { label: '조', key: 'team_name' },
      { label: '티타임/홀', key: 'tee_info' },
      { label: '인원', value: (t) => seatsOf(t.member_ids) + (t.extra_members || []).length },
      { label: '명단', value: (t) => {
        const names = [];
        (t.member_ids || []).forEach((id) => {
          names.push(displayName(pMap[id]));
          companionNames(pMap[id]).forEach((c) => names.push(`${companionLabel(c)}(동반)`));
        });
        (t.extra_members || []).forEach((nm) => names.push(`${nm}(기타)`));
        return names.join(' | ');
      } },
    ]);
    downloadCsv('mou_golf_teams.csv', csv);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>
          골프 팀 편성 · 골퍼 {golfers.length}명{golfCompanions > 0 ? ` + 동반자 ${golfCompanions}명` : ''} (총 {golfers.length + golfCompanions}명) · {teams.length}개 조 · 미배정 {unassignedHead}명
        </CardTitle>
        <span style={{ display: 'flex', gap: 8 }}>
          <GhostButton onClick={exportCsv}>CSV 내보내기</GhostButton>
          <PrimaryButton onClick={addTeam}>+ 조 추가</PrimaryButton>
        </span>
      </CardHead>
      <CardBody>
        {msg && <Message $error={msg.error}>{msg.text}</Message>}
        {loading && <Message>불러오는 중…</Message>}

        {!loading && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem', color: '#374151' }}>
                미배정 골퍼 ({unassignedHead}명, 동반자 포함)
              </div>
              <Pool>
                {unassigned.length === 0
                  ? <Empty>모든 골퍼가 조에 배정되었습니다 🎉</Empty>
                  : unassigned.map((p) => {
                    const cc = compOf(p);
                    const st = memberBadgeStyle(p.member_type);
                    return (
                      <Badge key={p.id} $bg={st.bg} $color={st.color}>
                        {displayName(p)}{st.tag ? ` · ${st.tag}` : ''}{cc > 0 ? ` +${cc}` : ''}
                      </Badge>
                    );
                  })}
              </Pool>
            </div>

            {teams.length === 0 ? (
              <Empty>아직 조가 없습니다. “+ 조 추가”로 시작하세요.</Empty>
            ) : (
              <AssignGrid>
                {teams.map((team) => {
                  const mem = team.member_ids || [];
                  const extra = team.extra_members || [];
                  const seats = seatsOf(mem) + extra.length;
                  const over = seats > TEAM_CAP;
                  return (
                    <AssignCard key={team.id} $over={over}>
                      <AssignCardHead>
                        <AssignCardTitle>
                          <MiniInput
                            defaultValue={team.team_name || ''}
                            onBlur={(e) => save(team, { team_name: e.target.value })}
                            style={{ width: 120 }}
                          />
                        </AssignCardTitle>
                        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <CapTag $over={over}>{seats}/{TEAM_CAP}명</CapTag>
                          <IconButton onClick={() => removeTeam(team.id)}>삭제</IconButton>
                        </span>
                      </AssignCardHead>
                      <MiniInput
                        placeholder="티타임 / 홀 (예: 1:00 PM, 1번홀)"
                        defaultValue={team.tee_info || ''}
                        onBlur={(e) => save(team, { tee_info: e.target.value })}
                      />
                      <ChipRow>
                        {mem.map((pid) => (
                          <React.Fragment key={pid}>
                            <Chip>
                              {displayName(pMap[pid]) || '(알수없음)'}
                              <button onClick={() => removeMember(team, pid)} title="제거">✕</button>
                            </Chip>
                            {companionNames(pMap[pid]).map((c, ci) => (
                              <Chip key={`${pid}-c${ci}`} style={{ background: 'rgba(155,89,182,0.12)', color: '#7d3c98' }}>
                                {companionLabel(c)} <span style={{ fontSize: '0.7rem' }}>(동반)</span>
                              </Chip>
                            ))}
                          </React.Fragment>
                        ))}
                        {extra.map((nm) => (
                          <Chip key={`x-${nm}`} style={{ background: 'rgba(52,152,219,0.12)', color: '#1f5a7a' }}>
                            {nm} <span style={{ fontSize: '0.7rem' }}>(기타)</span>
                            <button onClick={() => removeExtra(team, nm)} title="제거">✕</button>
                          </Chip>
                        ))}
                        {mem.length === 0 && extra.length === 0 && <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>비어 있음</span>}
                      </ChipRow>
                      <Select defaultValue="" onChange={(e) => { addMember(team, e.target.value); e.target.value = ''; }}>
                        <option value="">+ 골퍼 배정 (명단에서)</option>
                        {unassigned.map((p) => (
                          <option key={p.id} value={p.id}>
                            {displayName(p)}{compOf(p) > 0 ? ` +${compOf(p)}` : ''} · {p.member_type === '준비위원회' ? '준비위원회' : p.chapter}
                          </option>
                        ))}
                      </Select>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <MiniInput
                          placeholder="기타 골퍼 직접 입력 (명단에 없는 외부 골퍼)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { addExtra(team, e.target.value); e.target.value = ''; }
                          }}
                          id={`extra-${team.id}`}
                        />
                        <GhostButton
                          onClick={() => {
                            const el = document.getElementById(`extra-${team.id}`);
                            if (el) { addExtra(team, el.value); el.value = ''; }
                          }}
                        >추가</GhostButton>
                      </div>
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

export default Golf;
