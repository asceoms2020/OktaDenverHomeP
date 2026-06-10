import React, { useState } from 'react';
import {
  Overlay, Modal, ModalHead, ModalBody, ModalFoot, FieldGrid, FullRow,
  FieldLabel, FieldInput, FieldSelect, ProgramChips, ProgramChip,
  PrimaryButton, GhostButton, Message,
} from '../../styles/MouEventAdmin.styles';
import { insertParticipant, updateParticipant, PROGRAM_LABELS } from '../../services/mouAdmin';

const MEMBER_TYPES = ['정회원', '동반자', '차세대', '차세대봉사자', '준비위원회', '덴버지회'];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// 비행 시간 입력: 시/분 셀렉트 (항상 HH:MM 형식 보장)
const TimeSelect = ({ value, onChange }) => {
  const [h = '', m = ''] = (value || '').split(':');
  const set = (nh, nm) => {
    if (!nh && !nm) { onChange(''); return; }
    onChange(`${nh || '00'}:${nm || '00'}`);
  };
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <FieldSelect value={h} onChange={(e) => set(e.target.value, m)}>
        <option value="">시</option>
        {HOURS.map((x) => <option key={x} value={x}>{x}</option>)}
      </FieldSelect>
      <span style={{ fontWeight: 700, color: '#9ca3af' }}>:</span>
      <FieldSelect value={m} onChange={(e) => set(h, e.target.value)}>
        <option value="">분</option>
        {MINUTES.map((x) => <option key={x} value={x}>{x}</option>)}
      </FieldSelect>
    </div>
  );
};

const empty = {
  name_ko: '', name_en: '', chapter: '', position: '', member_type: '정회원',
  companion_count: 0, companion_name: '', phone: '', email: '', kakao_id: '',
  arrival_date: '', arrival_time: '', arrival_flight: '',
  departure_date: '', departure_time: '', departure_flight: '',
  room_type: '', room_no: '', programs: [], waiver_status: '',
  event_fee: '', fee_amount: '', payment_method: '', notes: '', golf_rental: false,
};

const ParticipantEditModal = ({ initial, onClose, onSaved }) => {
  const [form, setForm] = useState(() => ({ ...empty, ...(initial || {}), programs: initial?.programs || [] }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleProgram = (key) => {
    setForm((f) => {
      const has = (f.programs || []).includes(key);
      return { ...f, programs: has ? f.programs.filter((x) => x !== key) : [...(f.programs || []), key] };
    });
  };

  const submit = async () => {
    if (!form.name_ko && !form.name_en) { setErr('이름(한글 또는 영문)을 입력하세요.'); return; }
    setSaving(true);
    setErr('');
    try {
      const cc = parseInt(form.companion_count, 10) || 0;
      const payload = {
        name_ko: form.name_ko || null,
        name_en: form.name_en || null,
        chapter: form.chapter || null,
        position: form.position || null,
        member_type: form.member_type || null,
        companion_count: cc,
        has_companion: cc > 0,
        companion_name: form.companion_name || null,
        phone: form.phone || null,
        email: form.email || null,
        kakao_id: form.kakao_id || null,
        arrival_date: form.arrival_date || null,
        arrival_time: form.arrival_time || null,
        arrival_flight: form.arrival_flight || null,
        departure_date: form.departure_date || null,
        departure_time: form.departure_time || null,
        departure_flight: form.departure_flight || null,
        room_type: form.room_type || null,
        room_no: form.room_no || null,
        programs: form.programs || [],
        golf_rental: !!form.golf_rental,
        waiver_status: form.waiver_status || null,
        event_fee: form.event_fee || null,
        fee_amount: form.fee_amount || null,
        payment_method: form.payment_method || null,
        notes: form.notes || null,
      };
      if (initial?.id) await updateParticipant(initial.id, payload);
      else await insertParticipant(payload);
      await onSaved();
      onClose();
    } catch (e) {
      setErr(`저장 실패: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const F = (label, key, type = 'text') => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput type={type} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
    </div>
  );

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHead>
          <h3>{initial?.id ? '참가자 수정' : '참가자 추가'}</h3>
          <GhostButton onClick={onClose}>닫기</GhostButton>
        </ModalHead>
        <ModalBody>
          {err && <Message $error>{err}</Message>}
          <FieldGrid>
            {F('이름 (한글)', 'name_ko')}
            {F('이름 (영문)', 'name_en')}
            {F('지회', 'chapter')}
            {F('직책/Position', 'position')}
            <div>
              <FieldLabel>구분</FieldLabel>
              <FieldSelect value={form.member_type || ''} onChange={(e) => set('member_type', e.target.value)}>
                {MEMBER_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
              </FieldSelect>
            </div>
            {F('동반자 인원수', 'companion_count', 'number')}
            {F('동반자 이름', 'companion_name')}
            {F('전화번호', 'phone')}
            {F('이메일', 'email')}
            {F('카카오톡 ID', 'kakao_id')}

            {F('입국일', 'arrival_date', 'date')}
            <div>
              <FieldLabel>입국 시간</FieldLabel>
              <TimeSelect value={form.arrival_time} onChange={(v) => set('arrival_time', v)} />
            </div>
            <FullRow>{F('입국 항공편', 'arrival_flight')}</FullRow>
            {F('출국일', 'departure_date', 'date')}
            <div>
              <FieldLabel>출국 시간</FieldLabel>
              <TimeSelect value={form.departure_time} onChange={(v) => set('departure_time', v)} />
            </div>
            <FullRow>{F('출국 항공편', 'departure_flight')}</FullRow>

            {F('룸 타입', 'room_type')}
            <div>
              <FieldLabel>Room # (방 배정 탭에서 관리)</FieldLabel>
              <FieldInput value={initial?.id ? '방 배정 탭에서 변경' : '저장 후 방 배정 탭에서 배정'} disabled style={{ background: '#f3f4f6', color: '#9ca3af' }} />
            </div>

            <FullRow>
              <FieldLabel>참가 프로그램</FieldLabel>
              <ProgramChips>
                {Object.entries(PROGRAM_LABELS).map(([k, v]) => {
                  const on = (form.programs || []).includes(k);
                  return (
                    <ProgramChip key={k} $on={on}>
                      <input type="checkbox" checked={on} onChange={() => toggleProgram(k)} />
                      {v}
                    </ProgramChip>
                  );
                })}
              </ProgramChips>
            </FullRow>

            {(form.programs || []).includes('golf') && (
              <FullRow>
                <ProgramChip $on={!!form.golf_rental} style={{ display: 'inline-flex' }}>
                  <input type="checkbox" checked={!!form.golf_rental} onChange={() => set('golf_rental', !form.golf_rental)} />
                  골프 클럽 렌탈 (+$65)
                </ProgramChip>
              </FullRow>
            )}

            {F('Waiver 상태', 'waiver_status')}
            {F('행사 참여비', 'event_fee')}
            {F('참가비/금액', 'fee_amount')}
            {F('납부 방법', 'payment_method')}
            <FullRow>{F('비고', 'notes')}</FullRow>
          </FieldGrid>
        </ModalBody>
        <ModalFoot>
          <GhostButton onClick={onClose}>취소</GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </PrimaryButton>
        </ModalFoot>
      </Modal>
    </Overlay>
  );
};

export default ParticipantEditModal;
