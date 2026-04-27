import styled from 'styled-components';

// Events 전용 컨테이너
export const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

// 이벤트 그리드
export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// 다가오는 이벤트 섹션
export const UpcomingSection = styled.section`
  margin-bottom: 4rem;
`;

// 과거 이벤트 섹션
export const PastSection = styled.section`
  margin-bottom: 4rem;

  .past-event {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.6) 70%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
`;

// 포스터 컨테이너
export const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
`;

// 이벤트 카드
export const EventCard = styled.div`
  position: relative;
  background: #1e293b;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.07),
    0 10px 25px rgba(0, 0, 0, 0.12),
    0 20px 40px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s ease;
  height: 400px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  /* subtle bottom-edge gradient in normal state */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.55), transparent);
    pointer-events: none;
    border-radius: 0 0 24px 24px;
    transition: opacity 0.35s ease;
  }

  &:hover {
    transform: translateY(-8px) ${props => props.$clickable ? 'scale(1.018)' : 'scale(1.008)'};
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.12),
      0 20px 40px rgba(0, 0, 0, 0.18),
      0 32px 64px rgba(0, 0, 0, 0.14),
      0 0 0 1px rgba(16, 185, 129, 0.18);
  }

  &:hover::after {
    opacity: 0;
  }

  &:hover .click-indicator {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover ${PosterContainer} img {
    transform: scale(1.08);
  }
`;

// 이벤트 포스터 이미지
export const EventPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 이벤트 오버레이
export const EventOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(15, 23, 42, 0.25) 45%,
    rgba(15, 23, 42, 0.70) 72%,
    rgba(15, 23, 42, 0.85) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
`;

// 이벤트 제목
export const EventTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.45rem;
  color: #ffffff;
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
`;

// 이벤트 날짜
export const EventDate = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 0.75rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  letter-spacing: 0.01em;
`;

// 이벤트 설명
export const EventDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(248, 250, 252, 0.88);
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

// 클릭 표시
export const ClickIndicator = styled.span`
  font-size: 0.88rem;
  color: #10b981;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  letter-spacing: 0.02em;
`;

// 이벤트 배지
export const EventBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 0.42rem 1rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  z-index: 2;
  box-shadow:
    0 4px 12px rgba(220, 38, 38, 0.45),
    0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse-badge 2.2s ease-in-out infinite;

  @keyframes pulse-badge {
    0%   { transform: scale(1);    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.45), 0 2px 4px rgba(0,0,0,0.2); }
    50%  { transform: scale(1.07); box-shadow: 0 6px 18px rgba(220, 38, 38, 0.6),  0 2px 4px rgba(0,0,0,0.2); }
    100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.45), 0 2px 4px rgba(0,0,0,0.2); }
  }
`;

// Zeffy 섹션
export const ZeffySection = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a6e 100%);
  padding: 3.5rem 3rem;
  border-radius: 28px;
  text-align: center;
  color: white;
  margin: 3rem 0;
  box-shadow:
    0 8px 20px rgba(15, 23, 42, 0.35),
    0 20px 50px rgba(15, 23, 42, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.88;
    line-height: 1.65;
    color: #e2e8f0;
  }
`;

// Zeffy 버튼
export const ZeffyButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2.75rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease,
              filter 0.25s ease;
  box-shadow:
    0 6px 20px rgba(16, 185, 129, 0.42),
    0 2px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow:
      0 10px 28px rgba(16, 185, 129, 0.55),
      0 4px 10px rgba(0, 0, 0, 0.18);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
    filter: brightness(0.97);
  }
`;

// 이벤트 버튼 (범용)
export const EventButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.6rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease,
              filter 0.25s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.38);

  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 22px rgba(59, 130, 246, 0.5);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0) scale(1);
    filter: brightness(0.97);
  }
`;

// 관리자 액션 컨테이너
export const AdminActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

// 이벤트 추가 버튼
export const AddEventButton = styled(EventButton)`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.38);
  padding: 1rem 2.2rem;
  font-size: 1.05rem;

  &:hover {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    box-shadow: 0 8px 22px rgba(139, 92, 246, 0.52);
  }
`;

// 편집 버튼
export const EditButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.12);
  z-index: 100;
  transition: background-color 0.22s ease,
              color 0.22s ease,
              transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.22s ease;

  &:hover {
    background-color: #10b981;
    color: white;
    transform: scale(1.12);
    box-shadow:
      0 4px 14px rgba(16, 185, 129, 0.45),
      0 2px 6px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// 반응형 조정
export const ResponsiveEventSection = styled.div`
  @media (max-width: 1024px) {
    ${EventsGrid} {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    ${EventCard} {
      height: 350px;
    }
  }

  @media (max-width: 768px) {
    ${EventsGrid} {
      grid-template-columns: 1fr;
    }

    ${EventCard} {
      height: 300px;
    }

    ${EventOverlay} {
      padding: 1.5rem;
    }

    ${EventTitle} {
      font-size: 1.25rem;
    }

    ${EventDescription} {
      font-size: 0.9rem;
    }

    ${ZeffySection} {
      padding: 2rem 1.5rem;

      h3 {
        font-size: 1.6rem;
      }

      p {
        font-size: 1rem;
      }
    }

    ${ZeffyButton} {
      padding: 0.85rem 2rem;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    ${EventCard} {
      height: 280px;
    }

    ${EventOverlay} {
      padding: 1.2rem;
    }

    ${EventTitle} {
      font-size: 1.1rem;
    }

    ${EventBadge} {
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.35rem 0.75rem;
      font-size: 0.7rem;
    }
  }
`;

// 특별 효과 (옵션)
export const EventGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 이벤트 카테고리 태그
export const EventCategory = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #f1f5f9;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
`;
