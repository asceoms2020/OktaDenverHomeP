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
  border-radius: 20px;
`;

// 이벤트 카드
export const EventCard = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 400px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-10px) ${props => props.$clickable ? 'scale(1.02)' : 'scale(1.01)'};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &:hover .click-indicator {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover ${PosterContainer} img {
    transform: scale(1.1);
  }
`;

// 이벤트 포스터 이미지
export const EventPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
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
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
`;

// 이벤트 제목
export const EventTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
  line-height: 1.3;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

// 이벤트 날짜
export const EventDate = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #3498db;
  margin-bottom: 0.8rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

// 이벤트 설명
export const EventDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

// 클릭 표시
export const ClickIndicator = styled.span`
  font-size: 0.9rem;
  color: #2ecc71;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

// 이벤트 배지
export const EventBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  animation: pulse-badge 2s infinite;
  
  @keyframes pulse-badge {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Zeffy 섹션
export const ZeffySection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 25px;
  text-align: center;
  color: white;
  margin: 3rem 0;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
  
  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

// Zeffy 버튼
export const ZeffyButton = styled.button`
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: linear-gradient(45deg, #27ae60, #229954);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(46, 204, 113, 0.5);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// 이벤트 버튼 (범용)
export const EventButton = styled.button`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #2980b9, #1f4e79);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
  }
  
  &:active {
    transform: translateY(0);
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
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  
  &:hover {
    background: linear-gradient(45deg, #8e44ad, #7d3c98);
    box-shadow: 0 8px 20px rgba(155, 89, 182, 0.4);
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
      font-size: 1.2rem;
    }
    
    ${EventDescription} {
      font-size: 0.9rem;
    }
    
    ${ZeffySection} {
      padding: 2rem;
      
      h3 {
        font-size: 1.6rem;
      }
      
      p {
        font-size: 1rem;
      }
    }
    
    ${ZeffyButton} {
      padding: 0.8rem 2rem;
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
      top: 0.8rem;
      right: 0.8rem;
      padding: 0.4rem 0.8rem;
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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;
