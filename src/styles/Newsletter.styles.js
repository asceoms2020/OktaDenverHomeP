import styled from 'styled-components';

// Newsletter 전용 컨테이너
export const NewsletterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

// ──────────────────────────────────────────────
// 웹진 카드
// ──────────────────────────────────────────────
export const WebzineCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-top-color 0.28s ease;
  border-top: 3px solid transparent;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
    border-top-color: #10b981;
  }
`;

export const WebzineImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  border-radius: 20px 20px 0 0;
`;

export const WebzineContent = styled.div`
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`;

export const WebzineDate = styled.div`
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

export const WebzineTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.45;
  margin-bottom: 0.85rem;
`;

export const WebzineExcerpt = styled.p`
  font-size: 0.97rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 1.5rem;
  flex: 1;
`;

// ──────────────────────────────────────────────
// 뉴스 카드
// ──────────────────────────────────────────────
export const NewsCard = styled.div`
  background: #ffffff;
  padding: 2rem 2.25rem;
  border-radius: 16px;
  border-left: 4px solid #10b981;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.07);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateX(6px);
    box-shadow: 0 10px 32px rgba(15, 23, 42, 0.12);
  }
`;

export const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const NewsDate = styled.span`
  font-size: 0.88rem;
  color: #94a3b8;
  font-weight: 500;
`;

export const NewsSource = styled.span`
  font-size: 0.82rem;
  color: #059669;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
`;

export const NewsTitle = styled.h3`
  font-size: 1.45rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.9rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
`;

export const NewsContent = styled.div`
  margin-bottom: 1.25rem;
`;

export const NewsSummary = styled.p`
  font-size: 0.97rem;
  line-height: 1.75;
  color: #64748b;
  margin-bottom: 1.5rem;
`;

// ──────────────────────────────────────────────
// 이벤트 카드
// ──────────────────────────────────────────────
export const EventCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  transition: transform 0.28s ease, box-shadow 0.28s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.11);
  }
`;

export const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1.25rem 1.5rem 1.5rem;
`;

export const EventTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

export const EventDate = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

// ──────────────────────────────────────────────
// 버튼
// ──────────────────────────────────────────────
export const ReadMoreBtn = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  border: none;
  padding: 0.72rem 1.6rem;
  border-radius: 9999px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  letter-spacing: 0.02em;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;

  &:hover {
    background: linear-gradient(135deg, #0ea472, #047857);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.38);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const ViewMoreWebzineBtn = styled.button`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a6e 100%);
  color: #ffffff;
  border: 1.5px solid transparent;
  padding: 1.1rem 3rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  /* shimmer sweep */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.18) 50%,
      transparent 100%
    );
    transition: left 0.55s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.03);
    border-color: #10b981;
    box-shadow:
      0 18px 44px rgba(15, 23, 42, 0.35),
      0 0 0 3px rgba(16, 185, 129, 0.22);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.25);
  }

  @media (max-width: 768px) {
    padding: 0.95rem 2rem;
    font-size: 0.95rem;
  }
`;

// ──────────────────────────────────────────────
// 레이아웃 / 섹션
// ──────────────────────────────────────────────
export const WebzineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const NewsSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  padding: 2.75rem 3rem;
  border-radius: 20px;
  margin: 1.5rem 0;
`;

export const CategoryTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ViewMoreSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 0;
  padding: 1.5rem 0;
`;
