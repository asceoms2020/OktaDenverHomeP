import styled, { keyframes, css } from 'styled-components';

/* ── Animations ─────────────────────────────────────────────── */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const plusPulse = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.45; }
  50%       { transform: scale(1.15) rotate(15deg); opacity: 0.7; }
`;

const plusHover = keyframes`
  0%   { transform: scale(1) rotate(0deg); }
  40%  { transform: scale(1.25) rotate(-10deg); }
  70%  { transform: scale(1.1) rotate(8deg); }
  100% { transform: scale(1.2) rotate(0deg); }
`;

/* ── Layout ─────────────────────────────────────────────────── */
export const SponsorsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8fafc;
`;

export const PremiumSection = styled.section`
  margin-bottom: 6rem;
`;

export const RegularSection = styled.section`
  margin-bottom: 6rem;
`;

export const SponsorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

/* ── Sponsor Card ───────────────────────────────────────────── */
export const SponsorCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  ${props => props.premium && css`
    border: 2px solid #10b981;
    box-shadow: 0 8px 32px rgba(16, 185, 129, 0.15);
  `}

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);

    ${props => props.premium && css`
      box-shadow: 0 16px 48px rgba(16, 185, 129, 0.25);
    `}
  }
`;

export const LogoContainer = styled.div`
  height: 180px;
  background: ${props =>
    props.premium
      ? 'linear-gradient(135deg, #f0fdf9 0%, #d1fae5 100%)'
      : '#f8fafc'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const SponsorLogo = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  ${SponsorCard}:hover & {
    transform: scale(1.05);
  }
`;

export const SponsorContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CompanyInfo = styled.div`
  margin-bottom: 1rem;
`;

export const SponsorName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

export const SponsorCategory = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  color: #059669;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  letter-spacing: 0.01em;
`;

export const SponsorDescription = styled.p`
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.65;
  margin-bottom: 1.5rem;
  flex: 1;
`;

export const ContactInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

export const SponsorWebsite = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export const ClickIndicator = styled.div`
  font-size: 0.85rem;
  color: #10b981;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  font-weight: 600;

  ${SponsorCard}:hover & {
    opacity: 1;
    transform: translateY(0);
    animation: ${fadeSlideUp} 0.3s ease both;
  }
`;

export const SponsorBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
  z-index: 10;
`;

/* ── Empty Slot ─────────────────────────────────────────────── */
export const EmptySlot = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 20px;
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease, color 0.3s ease;
  cursor: pointer;
  color: #94a3b8;
  position: relative;
  overflow: hidden;
  gap: 0.5rem;

  &::before {
    content: '+';
    font-size: 3.5rem;
    font-weight: 200;
    line-height: 1;
    animation: ${plusPulse} 3s ease-in-out infinite;
    transition: color 0.3s ease;
  }

  &:hover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.03);
    color: #10b981;
    transform: translateY(-4px);

    &::before {
      animation: ${plusHover} 0.4s ease both;
      color: #10b981;
    }
  }

  span {
    font-size: 1.05rem;
    font-weight: 600;
  }

  small {
    font-size: 0.875rem;
    margin-top: 0.25rem;
    opacity: 0.8;
  }
`;

/* ── Recruitment Section ────────────────────────────────────── */
export const RecruitmentSection = styled.div`
  text-align: center;
  padding: 5rem 3rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a6e 100%);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  margin-top: 6rem;
  position: relative;
  overflow: hidden;

  /* Subtle radial highlight */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  h3 {
    font-size: 2.4rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
    position: relative;
    z-index: 1;
  }

  p {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.8;
    margin-bottom: 2.75rem;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1;
  }
`;

export const ContactButton = styled.button`
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  border: none;
  padding: 0.9rem 3rem;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  letter-spacing: 0.01em;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(16, 185, 129, 0.5);
    filter: brightness(1.06);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
    filter: brightness(0.97);
  }
`;
