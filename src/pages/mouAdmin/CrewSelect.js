import React from 'react';
import { Select } from '../../styles/MouEventAdmin.styles';
import { STAFF_GROUPS } from '../../services/mouAdmin';

/**
 * 운영 인력(mou_staff) 명단 기반 셀렉트 — 운전자/인솔자/봉사자 선택용.
 * props: value(현재 이름), onChange(name), groups(staffByGroup)
 */
const CrewSelect = ({ value, onChange, groups }) => {
  const known = STAFF_GROUPS.some((g) => (groups[g] || []).some((s) => s.name === value));
  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: '6px 8px', fontSize: '0.85rem', width: '100%' }}
    >
      <option value="">선택</option>
      {/* 명단에 없는 기존 값 보존 */}
      {value && !known && <option value={value}>{value}</option>}
      {STAFF_GROUPS.map((g) => (
        (groups[g] || []).length > 0 && (
          <optgroup key={g} label={g}>
            {groups[g].map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}{s.title ? ` (${s.title})` : ''}
              </option>
            ))}
          </optgroup>
        )
      ))}
    </Select>
  );
};

export default CrewSelect;
