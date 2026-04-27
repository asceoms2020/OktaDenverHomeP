import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─────────────────────────────────────────────
   Page wrapper
───────────────────────────────────────────── */
export const ResourcesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
`;

/* ─────────────────────────────────────────────
   Page title — navy → emerald gradient text
───────────────────────────────────────────── */
export const Title = styled.h1`
  font-size: 3.75rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.1;
  text-align: center;
  margin-bottom: 4rem;

  background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: 768px) {
    font-size: 2.4rem;
    margin-bottom: 3rem;
    letter-spacing: -1px;
  }
`;

/* ─────────────────────────────────────────────
   Generic section wrapper
───────────────────────────────────────────── */
export const Section = styled.section`
  margin-bottom: 6rem;
  position: relative;
`;

/* ─────────────────────────────────────────────
   Section heading with emerald → blue accent bar
───────────────────────────────────────────── */
export const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.2s forwards;

  &::after {
    content: '';
    display: block;
    width: 44px;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    border-radius: 2px;
    margin: 1rem auto 0;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

/* ─────────────────────────────────────────────
   MOU card — row on desktop, column on mobile
───────────────────────────────────────────── */
export const MOUSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;

  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 4rem;

  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 20px 40px rgba(0, 0, 0, 0.06);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  animation: ${fadeIn} 0.9s ease-out 0.35s forwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 12px rgba(0, 0, 0, 0.05),
      0 30px 55px rgba(0, 0, 0, 0.09);
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 2.5rem;
    gap: 2.5rem;
    text-align: center;
    border-radius: 20px;
  }
`;

/* ─────────────────────────────────────────────
   Text side of the MOU card
───────────────────────────────────────────── */
export const MOUContent = styled.div`
  flex: 1;

  h3 {
    font-size: 1.9rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 1.25rem;
    line-height: 1.25;
  }

  p {
    font-size: 1.075rem;
    line-height: 1.85;
    color: #64748b;
    margin-bottom: 2rem;
    word-break: keep-all;
  }
`;

/* ─────────────────────────────────────────────
   Benefits list — no default bullets
───────────────────────────────────────────── */
export const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  @media (max-width: 1024px) {
    align-items: center;
    text-align: left;
  }
`;

/* ─────────────────────────────────────────────
   Individual benefit row with emerald check
───────────────────────────────────────────── */
export const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: #334155;
  padding: 0.35rem 0;

  &::before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
  }
`;

/* ─────────────────────────────────────────────
   World-map image container
───────────────────────────────────────────── */
export const WorldMapContainer = styled.div`
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  padding: 1.75rem;

  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 12px 28px rgba(0, 0, 0, 0.07);

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.08));
    transition: transform 0.45s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }

  @media (max-width: 1024px) {
    width: 100%;
    min-height: 260px;
  }
`;
