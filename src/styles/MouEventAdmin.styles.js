import styled from 'styled-components';

export const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 18px 60px;
  color: #1f2a37;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 0.92rem;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(17, 24, 39, 0.1);
  margin-bottom: 20px;
`;

export const Tab = styled.button`
  appearance: none;
  border: none;
  background: ${(p) => (p.$active ? '#ffffff' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'rgba(46,204,113,0.5)' : 'transparent')};
  border-bottom: ${(p) => (p.$active ? '2px solid #2ecc71' : '2px solid transparent')};
  color: ${(p) => (p.$active ? '#1f7a3b' : '#6b7280')};
  font-weight: ${(p) => (p.$active ? 800 : 600)};
  font-size: 0.92rem;
  padding: 10px 14px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    color: #1f7a3b;
    background: rgba(46, 204, 113, 0.06);
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
  overflow: hidden;
  margin-bottom: 18px;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.06));
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
`;

export const CardBody = styled.div`
  padding: 16px 18px;
`;

/* ---- 통계 카드 ---- */
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
`;

export const Stat = styled.div`
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-left: 4px solid ${(p) => p.$accent || '#2ecc71'};
  border-radius: 12px;
  padding: 14px 16px;
`;

export const StatLabel = styled.div`
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 600;
`;

export const StatValue = styled.div`
  margin-top: 4px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1f2a37;
`;

export const StatSub = styled.div`
  margin-top: 2px;
  font-size: 0.8rem;
  color: #9ca3af;
`;

/* ---- 표 ---- */
export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 12px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  white-space: nowrap;

  th, td {
    padding: 9px 12px;
    border-bottom: 1px solid rgba(17, 24, 39, 0.06);
    text-align: left;
  }
  th {
    background: #f8fafc;
    color: #374151;
    font-weight: 700;
    position: sticky;
    top: 0;
  }
  tbody tr:hover {
    background: rgba(46, 204, 113, 0.04);
  }
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 14px;
`;

export const Input = styled.input`
  padding: 9px 12px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: rgba(52,152,219,0.7); box-shadow: 0 0 0 3px rgba(52,152,219,0.12); }
`;

export const Select = styled.select`
  padding: 9px 12px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  font-size: 0.9rem;
  background: #fff;
  outline: none;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  background: ${(p) => p.$bg || 'rgba(52,152,219,0.12)'};
  color: ${(p) => p.$color || '#1f5a7a'};
`;

export const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 9px 16px;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export const GhostButton = styled.button`
  appearance: none;
  border: 1px solid rgba(17, 24, 39, 0.16);
  border-radius: 999px;
  padding: 8px 14px;
  background: #fff;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover { border-color: rgba(46,204,113,0.6); color: #1f7a3b; }
`;

export const CheckButton = styled.button`
  appearance: none;
  border: 1px solid ${(p) => (p.$on ? 'rgba(46,204,113,0.6)' : 'rgba(17,24,39,0.18)')};
  background: ${(p) => (p.$on ? 'rgba(46,204,113,0.12)' : '#fff')};
  color: ${(p) => (p.$on ? '#1f7a3b' : '#6b7280')};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  &:hover { border-color: rgba(46,204,113,0.6); }
`;

export const Message = styled.div`
  margin: 12px 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$error ? 'rgba(231,76,60,0.35)' : 'rgba(46,204,113,0.35)')};
  background: ${(p) => (p.$error ? 'rgba(231,76,60,0.08)' : 'rgba(46,204,113,0.08)')};
  color: ${(p) => (p.$error ? '#c0392b' : '#1f7a3b')};
  font-size: 0.9rem;
`;

export const Gate = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 140px 20px 80px;
  text-align: center;
  h1 { font-size: 1.5rem; margin-bottom: 8px; }
  p { color: #6b7280; }
`;

export const Empty = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.92rem;
`;

export const MiniInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 8px;
  font-size: 0.85rem;
  outline: none;
  &:focus { border-color: rgba(52,152,219,0.7); }
`;

/* ---- 배정 보드 (방/차량) ---- */
export const AssignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
`;

export const AssignCard = styled.div`
  background: #ffffff;
  border: 1px solid ${(p) => (p.$over ? 'rgba(231,76,60,0.5)' : 'rgba(17,24,39,0.1)')};
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AssignCardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const AssignCardTitle = styled.div`
  font-weight: 800;
  font-size: 0.98rem;
  color: #1f2a37;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 10px;
  border-radius: 999px;
  background: rgba(46, 204, 113, 0.1);
  color: #1f7a3b;
  font-size: 0.82rem;
  font-weight: 600;

  button {
    appearance: none;
    border: none;
    background: transparent;
    color: #c0392b;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    padding: 0;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
`;

export const Pool = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const PoolChip = styled.button`
  appearance: none;
  border: 1px dashed rgba(17, 24, 39, 0.22);
  background: #fff;
  border-radius: 999px;
  padding: 5px 11px;
  font-size: 0.82rem;
  color: #374151;
  cursor: pointer;
  &:hover { border-color: rgba(46,204,113,0.7); color: #1f7a3b; background: rgba(46,204,113,0.06); }
`;

export const CapTag = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${(p) => (p.$over ? '#c0392b' : '#6b7280')};
`;

export const IconButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #c0392b;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  &:hover { text-decoration: underline; }
`;

/* ---- 모달 (참가자 추가/수정) ---- */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  overflow-y: auto;
  z-index: 1000;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
  overflow: hidden;
`;

export const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.12), rgba(52, 152, 219, 0.08));
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
  h3 { margin: 0; font-size: 1.1rem; }
`;

export const ModalBody = styled.div`
  padding: 18px 20px;
  max-height: 70vh;
  overflow-y: auto;
`;

export const ModalFoot = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid rgba(17, 24, 39, 0.06);
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const FullRow = styled.div`
  grid-column: 1 / -1;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 5px;
`;

export const FieldInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 11px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 9px;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: rgba(52,152,219,0.7); box-shadow: 0 0 0 3px rgba(52,152,219,0.12); }
`;

export const FieldSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 11px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 9px;
  font-size: 0.9rem;
  background: #fff;
  outline: none;
`;

/* ---- 진행률 / 업무 그룹 ---- */
export const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

export const ProgressBar = styled.div`
  flex: 1;
  min-width: 160px;
  height: 12px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.08);
  overflow: hidden;
  display: flex;
`;

export const ProgressSeg = styled.div`
  height: 100%;
  width: ${(p) => p.$pct || 0}%;
  background: ${(p) => p.$color};
  transition: width 200ms ease;
`;

export const GroupHeaderRow = styled.tr`
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.08), rgba(52, 152, 219, 0.05));
  cursor: pointer;
  td {
    font-weight: 800;
    color: #1f2a37;
    padding: 10px 12px !important;
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  }
  &:hover td { background: rgba(46, 204, 113, 0.06); }
`;

/* ---- 개회식 자리배치(볼룸) ---- */
export const Ballroom = styled.div`
  position: relative;
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 16px;
  background:
    linear-gradient(0deg, rgba(46,204,113,0.03), rgba(52,152,219,0.03));
  padding: 16px 16px 24px 64px;
  overflow-x: auto;
`;

export const StageBar = styled.div`
  height: 40px;
  margin: 4px 8px 18px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1f2a37, #374151);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.25em;
  font-weight: 800;
  font-size: 0.9rem;
`;

export const BeverageBar = styled.div`
  position: absolute;
  left: 14px;
  top: 70px;
  bottom: 28px;
  width: 34px;
  border: 1px dashed rgba(17, 24, 39, 0.25);
  border-radius: 8px;
  background: rgba(17, 24, 39, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  font-size: 0.72rem;
  color: #6b7280;
  letter-spacing: 0.1em;
`;

export const TablesArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px 30px;
  justify-content: center;
  padding: 8px 0;
`;

export const TableBox = styled.div`
  position: relative;
  width: 118px;
  height: 118px;
  flex: 0 0 auto;
`;

export const TableCircle = styled.button`
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? '#1f2a37' : p.$ring)};
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: ${(p) => (p.$selected ? '0 0 0 3px rgba(31,42,55,0.18)' : '0 4px 10px rgba(17,24,39,0.08)')};
  transition: transform 100ms ease, box-shadow 100ms ease;
  &:hover { transform: scale(1.04); }
  .t-label { font-weight: 800; font-size: 0.82rem; line-height: 1.1; text-align: center; }
  .t-count { font-size: 0.72rem; font-weight: 700; opacity: 0.85; }
`;

export const SeatDot = styled.span`
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(17, 24, 39, 0.25);
  background: ${(p) => (p.$on ? '#2ecc71' : '#ffffff')};
  left: 50%;
  top: 50%;
  margin: -6.5px 0 0 -6.5px;
  transform: ${(p) => `rotate(${p.$angle}deg) translate(0, -52px) rotate(${-p.$angle}deg)`};
`;

export const ProgramChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ProgramChip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${(p) => (p.$on ? '#2ecc71' : 'rgba(17,24,39,0.16)')};
  background: ${(p) => (p.$on ? 'rgba(46,204,113,0.1)' : '#fff')};
  color: ${(p) => (p.$on ? '#1f7a3b' : '#374151')};
  border-radius: 999px;
  font-size: 0.84rem;
  cursor: pointer;
  input { display: none; }
`;
