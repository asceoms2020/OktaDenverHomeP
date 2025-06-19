import styled from 'styled-components';

// Sponsors 전용 컨테이너
export const SponsorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

// 스폰서 그리드
export const SponsorsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.premium ? 'repeat(auto-fit, minmax(450px, 1fr))' : 'repeat(auto-fit, minmax(350px, 1fr))'};
  gap: ${props => props.premium ? '3rem' : '2.5rem'};
  
  @media (max-width: 1024px) {
    grid-template-columns: ${props => props.premium ? 'repeat(auto-fit, minmax(400px, 1fr))' : 'repeat(auto-fit, minmax(300px, 1fr))'};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// 프리미엄 섹션
export const PremiumSection = styled.section`
  margin-bottom: 4rem;
  
  ${SponsorCard} {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

// 일반 섹션
export const RegularSection = styled.section`
  margin-bottom: 4rem;
`;

// 스폰서 카드
export const SponsorCard = styled.div`
  position: relative;
  background: ${props => props.premium ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff'};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.premium ? '0 15px 35px rgba(102, 126, 234, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  cursor: pointer;
  border: ${props => props.premium ? '2px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: ${props => props.premium ? '0 25px 50px rgba(102, 126, 234, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.15)'};
  }
  
  &:hover .click-indicator {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 로고 컨테이너
export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.premium ? '2.5rem 2rem 1.5rem 2rem' : '2rem 2rem 1rem 2rem'};
  background: ${props => props.premium ? 'rgba(255, 255, 255, 0.1)' : 'rgba(248, 249, 250, 0.5)'};
  backdrop-filter: blur(10px);
  min-height: ${props => props.premium ? '120px' : '100px'};
`;

// 스폰서 로고
export const SponsorLogo = styled.img`
  max-width: 150px;
  max-height: 80px;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  filter: ${props => props.premium ? 'brightness(1.1)' : 'none'};
  
  ${SponsorCard}:hover & {
    transform: scale(1.1);
  }
`;

// 스폰서 컨텐츠
export const SponsorContent = styled.div`
  padding: ${props => props.premium ? '2rem' : '1.5rem'};
  color: ${props => props.premium ? 'white' : '#333'};
`;

// 회사 정보 컨테이너
export const CompanyInfo = styled.div`
  margin-bottom: 1rem;
`;

// 스폰서 이름
export const SponsorName = styled.h3`
  font-size: ${props => props.premium ? '1.6rem' : '1.4rem'};
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.premium ? 'white' : '#2c3e50'};
  line-height: 1.3;
`;

// 스폰서 카테고리
export const SponsorCategory = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.premium ? 'rgba(255, 255, 255, 0.8)' : '#3498db'};
  background: ${props => props.premium ? 'rgba(255, 255, 255, 0.2)' : 'rgba(52, 152, 219, 0.1)'};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  display: inline-block;
  margin-bottom: 1rem;
`;

// 스폰서 설명
export const SponsorDescription = styled.p`
  font-size: ${props => props.premium ? '1.05rem' : '1rem'};
  line-height: 1.6;
  color: ${props => props.premium ? 'rgba(255, 255, 255, 0.9)' : '#666'};
  margin-bottom: 1.5rem;
  text-align: justify;
  word-break: keep-all;
`;

// 연락처 정보
export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  span {
    color: ${props => props.premium ? 'rgba(255, 255, 255, 0.8)' : '#7f8c8d'};
    font-weight: 500;
  }
`;

// 웹사이트 링크
export const SponsorWebsite = styled.div`
  font-size: 0.85rem;
  color: ${props => props.premium ? '#2ecc71' : '#3498db'};
  font-weight: 600;
  word-break: break-all;
`;

// 클릭 표시
export const ClickIndicator = styled.span`
  font-size: 0.9rem;
  color: ${props => props.premium ? '#2ecc71' : '#27ae60'};
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  display: block;
  margin-top: 0.5rem;
`;

// 스폰서 배지
export const SponsorBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.premium ? 'linear-gradient(45deg, #f39c12, #e67e22)' : 'linear-gradient(45deg, #3498db, #2980b9)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.premium && `
    animation: premium-glow 2s infinite alternate;
    
    @keyframes premium-glow {
      0% { box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4); }
      100% { box-shadow: 0 6px 20px rgba(243, 156, 18, 0.6); }
    }
  `}
`;

// 후원사 모집 섹션
export const RecruitmentSection = styled.section`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  border-radius: 25px;
  text-align: center;
  margin: 3rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #555;
    line-height: 1.7;
    margin-bottom: 2rem;
  }
`;

// 반응형 조정
export const ResponsiveSponsorsSection = styled.div`
  @media (max-width: 1024px) {
    ${SponsorsGrid} {
      gap: 2rem;
    }
    
    ${SponsorCard} {
      margin-bottom: 1rem;
    }
    
    ${LogoContainer} {
      min-height: 90px;
      padding: 2rem 1.5rem 1rem 1.5rem;
    }
    
    ${SponsorLogo} {
      max-width: 130px;
      max-height: 70px;
    }
  }
  
  @media (max-width: 768px) {
    ${SponsorContent} {
      padding: 1.5rem;
    }
    
    ${SponsorName} {
      font-size: 1.3rem;
    }
    
    ${SponsorDescription} {
      font-size: 0.95rem;
    }
    
    ${LogoContainer} {
      min-height: 80px;
      padding: 1.5rem 1rem 0.5rem 1rem;
    }
    
    ${SponsorLogo} {
      max-width: 120px;
      max-height: 60px;
    }
    
    ${SponsorBadge} {
      top: 0.8rem;
      right: 0.8rem;
      padding: 0.4rem 0.8rem;
      font-size: 0.7rem;
    }
  }
  
  @media (max-width: 480px) {
    ${SponsorContent} {
      padding: 1.2rem;
    }
    
    ${SponsorName} {
      font-size: 1.2rem;
    }
    
    ${SponsorDescription} {
      font-size: 0.9rem;
    }
    
    ${ContactInfo} {
      font-size: 0.85rem;
    }
    
    ${SponsorWebsite} {
      font-size: 0.8rem;
    }
  }
`;

// 특별 효과 (옵션)
export const SponsorShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  
  .sponsor-mini {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    
    img {
      max-width: 100px;
      max-height: 50px;
      object-fit: contain;
    }
  }
`;

// 스폰서 통계 (옵션)
export const SponsorStats = styled.div`
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 20px;
  color: white;
  margin: 2rem 0;
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      display: block;
    }
    
    .stat-label {
      font-size: 1rem;
      opacity: 0.8;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    
    .stat-item .stat-number {
      font-size: 2rem;
    }
  }
`; 