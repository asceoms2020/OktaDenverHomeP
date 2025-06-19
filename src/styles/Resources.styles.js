import styled from 'styled-components';

// Resources 전용 컨테이너
export const ResourcesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

// MOU 섹션 스타일
export const MOUSection = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export const MOUContent = styled.div`
  margin-bottom: 3rem;
`;

export const MOUTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const MOUText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
  text-align: justify;
  word-break: keep-all;
`;

export const MOUDescription = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  border-left: 4px solid #3498db;
  margin-bottom: 2rem;
  
  h4 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.7;
    color: #666;
    margin-bottom: 1rem;
  }
`;

// 세계지도 컨테이너
export const WorldMapContainer = styled.div`
  position: relative;
  background: #fff;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  overflow: hidden;
`;

export const WorldMapImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

// 도시 포인트
export const CityPoint = styled.div`
  position: absolute;
  cursor: pointer;
  
  .pulse-dot {
    width: 12px;
    height: 12px;
    background: #e74c3c;
    border-radius: 50%;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      width: 16px;
      height: 16px;
      background: #e74c3c;
      border-radius: 50%;
      opacity: 0.5;
      animation: pulse 2s infinite;
    }
  }
  
  .main-dot {
    width: 16px;
    height: 16px;
    background: #3498db;
    border-radius: 50%;
    position: relative;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px #3498db;
    
    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      width: 26px;
      height: 26px;
      background: #3498db;
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse 2s infinite;
    }
  }
  
  &:hover .pulse-dot,
  &:hover .main-dot {
    transform: scale(1.2);
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.2;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

export const CityLabel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 120px;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  
  strong {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.2rem;
  }
  
  span {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
  
  &.denver-label {
    opacity: 1;
    bottom: 25px;
    
    strong {
      color: #3498db;
    }
  }
  
  ${CityPoint}:hover & {
    opacity: 1;
    bottom: 25px;
  }
`;

// 지도 범례
export const MapLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  
  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    
    &.main {
      background: #3498db;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #3498db;
    }
    
    &.partner {
      background: #e74c3c;
    }
  }
`;

// 회원혜택 그리드
export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 혜택 카드
export const BenefitCard = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 300px;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &:hover .click-indicator {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const BenefitImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${BenefitCard}:hover & {
    transform: scale(1.1);
  }
`;

export const BenefitOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
  
  .click-indicator {
    font-size: 0.9rem;
    color: #3498db;
    font-weight: 600;
    margin-top: 1rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
`;

export const BenefitTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`;

export const BenefitDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

// 연결선 (선택사항)
export const CityConnection = styled.div`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #e74c3c);
  opacity: 0.6;
  transform-origin: left center;
  
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: -2px;
    width: 0;
    height: 0;
    border-left: 6px solid #e74c3c;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
  }
`;

// 반응형 조정
export const ResponsiveSection = styled.div`
  @media (max-width: 1024px) {
    ${WorldMapContainer} {
      padding: 1.5rem;
    }
    
    ${WorldMapImage} {
      height: 300px;
    }
    
    ${CityPoint} {
      .pulse-dot,
      .main-dot {
        transform: scale(0.8);
      }
    }
  }
  
  @media (max-width: 768px) {
    ${MOUSection} {
      padding: 2rem;
    }
    
    ${MOUTitle} {
      font-size: 1.6rem;
    }
    
    ${MOUText} {
      font-size: 1rem;
    }
    
    ${BenefitsGrid} {
      gap: 1.5rem;
    }
    
    ${BenefitCard} {
      height: 250px;
    }
    
    ${BenefitOverlay} {
      padding: 1.5rem;
    }
  }
`; 