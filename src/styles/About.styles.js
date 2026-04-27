import styled from 'styled-components';

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const TRANSITION = '0.25s cubic-bezier(0.4, 0, 0.2, 1)';
const SHADOW_SM  = '0 2px 8px rgba(15,23,42,0.06)';
const SHADOW_MD  = '0 4px 16px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)';
const SHADOW_LG  = '0 12px 32px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.06)';
const SHADOW_HOVER = '0 20px 48px rgba(15,23,42,0.14), 0 6px 16px rgba(16,185,129,0.08)';

/* ─── Layout ──────────────────────────────────────────────────────────────── */

export const AboutContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
  font-family: 'Noto Sans KR', sans-serif;
  background: #f8fafc;
`;

/* ─── Typography ──────────────────────────────────────────────────────────── */

export const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: -1.5px;
  line-height: 1.08;
  margin-bottom: 4rem;
  background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.8rem;
    letter-spacing: -0.5px;
    margin-bottom: 3rem;
  }
`;

export const Content = styled.div`
  max-width: 860px;
  margin: 0 auto 6rem;
  text-align: center;

  p {
    font-size: 1.2rem;
    line-height: 2;
    color: #475569;
    font-weight: 400;
    word-break: keep-all;
    margin-bottom: 1.25rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Section = styled.section`
  margin-bottom: 8rem;
  padding: 2rem 0;
`;

export const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  letter-spacing: -0.5px;
  margin-bottom: 4rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 44px;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    border-radius: 9999px;
    margin: 1.25rem auto 0;
  }

  @media (max-width: 768px) {
    font-size: 1.9rem;
    margin-bottom: 3rem;
  }
`;

/* ─── CEO Section ─────────────────────────────────────────────────────────── */

export const CEOSection = styled.div`
  display: flex;
  gap: 5rem;
  align-items: center;
  background: #ffffff;
  padding: 5rem;
  border-radius: 28px;
  box-shadow: ${SHADOW_LG};
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #10b981;
  transition: box-shadow ${TRANSITION};

  &:hover {
    box-shadow: ${SHADOW_HOVER};
  }

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 3rem 2.5rem;
    gap: 3rem;
    text-align: center;
    border-left: none;
    border-top: 4px solid #10b981;
  }
`;

export const CEOImage = styled.img`
  width: 280px;
  height: 280px;
  min-width: 280px;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.18), 0 2px 8px rgba(15,23,42,0.10);
  transition: transform ${TRANSITION}, box-shadow ${TRANSITION};

  &:hover {
    transform: scale(1.025) translateY(-4px);
    box-shadow: 0 16px 48px rgba(16, 185, 129, 0.24), 0 4px 16px rgba(15,23,42,0.12);
  }

  @media (max-width: 968px) {
    width: 220px;
    height: 220px;
    min-width: 220px;
    margin: 0 auto;
  }
`;

export const CEOMessage = styled.div`
  flex: 1;

  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 1.5rem;
    letter-spacing: -0.5px;
    line-height: 1.25;
  }

  p {
    font-size: 1.1rem;
    line-height: 2;
    color: #475569;
    margin-bottom: 1.25rem;
    word-break: keep-all;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

/* ─── Board Section ───────────────────────────────────────────────────────── */

export const BoardSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  justify-content: center;
`;

export const BoardMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #ffffff;
  padding: 3rem 2rem 2.5rem;
  border-radius: 24px;
  box-shadow: ${SHADOW_MD};
  border: 1px solid #e2e8f0;
  transition: transform ${TRANSITION}, box-shadow ${TRANSITION}, border-color ${TRANSITION};
  cursor: default;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${SHADOW_HOVER};
    border-color: #10b981;
  }
`;

export const BoardImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 3px solid #ffffff;
  box-shadow: ${SHADOW_MD};
  transition: box-shadow ${TRANSITION};

  ${BoardMember}:hover & {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.22);
  }
`;

export const BoardAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: #059669;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #ecfdf5 100%);
  box-shadow: ${SHADOW_MD};
  transition: box-shadow ${TRANSITION};

  ${BoardMember}:hover & {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.22);
  }
`;

export const BoardName = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.6rem;
  letter-spacing: -0.25px;
`;

export const BoardPosition = styled.div`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  background: rgba(16, 185, 129, 0.10);
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid rgba(16, 185, 129, 0.20);
  transition: background ${TRANSITION};

  ${BoardMember}:hover & {
    background: rgba(16, 185, 129, 0.18);
  }
`;

/* ─── Image Gallery ───────────────────────────────────────────────────────── */

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const ImageContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${SHADOW_MD};
  border: 1px solid #e2e8f0;
  transition: transform ${TRANSITION}, box-shadow ${TRANSITION};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${SHADOW_LG};
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform ${TRANSITION};

  ${ImageContainer}:hover & {
    transform: scale(1.04);
  }
`;

export const ImageCaption = styled.div`
  padding: 0.9rem 1.1rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  background: #ffffff;
  letter-spacing: 0.01em;
`;

/* ─── Org Chart ───────────────────────────────────────────────────────────── */

export const OrgChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const OrgLevel = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const OrgBox = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  box-shadow: ${SHADOW_SM};
  transition: border-color ${TRANSITION}, box-shadow ${TRANSITION};

  &:hover {
    border-color: #10b981;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.12);
  }
`;

/* ─── Services ────────────────────────────────────────────────────────────── */

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
`;

export const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: ${SHADOW_MD};
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: transform ${TRANSITION}, box-shadow ${TRANSITION}, border-color ${TRANSITION};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${SHADOW_HOVER};
    border-color: #10b981;
  }
`;

export const ServiceIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto 1.5rem;
  transition: transform ${TRANSITION};

  ${ServiceCard}:hover & {
    transform: scale(1.1) rotate(-4deg);
  }
`;

export const ServiceTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.25px;
`;

export const ServiceDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.8;
  color: #64748b;
  word-break: keep-all;
`;

/* ─── Timeline ────────────────────────────────────────────────────────────── */

export const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #10b981 0%, #3b82f6 100%);
    border-radius: 9999px;
  }
`;

export const TimelineItem = styled.div`
  position: relative;
  padding: 0 0 3rem 2.5rem;

  &::before {
    content: '';
    position: absolute;
    left: -0.4rem;
    top: 0.35rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineYear = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #059669;
  background: rgba(16, 185, 129, 0.10);
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  margin-bottom: 0.6rem;
  letter-spacing: 0.04em;
`;

export const TimelineContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  box-shadow: ${SHADOW_SM};
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  line-height: 1.8;
  color: #475569;
  word-break: keep-all;
  transition: box-shadow ${TRANSITION};

  &:hover {
    box-shadow: ${SHADOW_MD};
  }
`;
