import styled from 'styled-components';

export const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 110px 20px 60px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  letter-spacing: -0.02em;
  color: #1f2a37;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 18px 18px 16px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.12), rgba(52, 152, 219, 0.08));
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
`;

export const CardHeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  color: #111827;
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FullRow = styled.div`
  grid-column: 1 / -1;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 12px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background: #ffffff;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus {
    border-color: rgba(52, 152, 219, 0.7);
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.12);
  }
`;

export const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 12px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background: #ffffff;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus {
    border-color: rgba(52, 152, 219, 0.7);
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Help = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 12px 16px;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(46, 204, 113, 0.25);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(46, 204, 113, 0.28);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const DangerButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 12px 16px;
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(231, 76, 60, 0.18);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(231, 76, 60, 0.22);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Message = styled.div`
  margin-top: 14px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid ${props => (props.$error ? 'rgba(231, 76, 60, 0.35)' : 'rgba(46, 204, 113, 0.35)')};
  background: ${props => (props.$error ? 'rgba(231, 76, 60, 0.08)' : 'rgba(46, 204, 113, 0.08)')};
  color: ${props => (props.$error ? '#c0392b' : '#1f7a3b')};
  line-height: 1.5;
`;

export const LoginGate = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 120px 20px 60px;
  color: #111827;
`;

export const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  margin: 20px 0 10px;
  padding-bottom: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2a37;
  border-bottom: 2px solid rgba(46, 204, 113, 0.3);

  &:first-of-type {
    margin-top: 0;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 10px 16px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  cursor: pointer;
  transition: all 120ms ease;
  background: #ffffff;

  &:hover {
    border-color: rgba(52, 152, 219, 0.5);
  }

  input {
    accent-color: #2ecc71;
    width: 18px;
    height: 18px;
  }

  &.selected {
    border-color: #2ecc71;
    background: rgba(46, 204, 113, 0.08);
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  cursor: pointer;
  transition: all 120ms ease;
  background: #ffffff;
  line-height: 1.5;

  &:hover {
    border-color: rgba(52, 152, 219, 0.5);
  }

  input {
    accent-color: #2ecc71;
    width: 18px;
    height: 18px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  &.checked {
    border-color: #2ecc71;
    background: rgba(46, 204, 113, 0.08);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  background: #ffffff;
  resize: vertical;
  min-height: 100px;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus {
    border-color: rgba(52, 152, 219, 0.7);
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.12);
  }
`;

export const Notice = styled.div`
  grid-column: 1 / -1;
  padding: 14px 16px;
  background: rgba(52, 152, 219, 0.08);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1f5a7a;
  line-height: 1.6;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 6px;
  }
`;
