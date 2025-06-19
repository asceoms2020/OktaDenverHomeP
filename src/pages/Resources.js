import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle,
  ServiceGrid,
  Content
} from '../styles/About.styles';
import {
  ResourcesContainer,
  MOUSection,
  MOUDescription,
  WorldMapContainer,
  WorldMapImage,
  CityConnection,
  CityPoint,
  CityLabel,
  BenefitsGrid,
  BenefitCard,
  BenefitImage,
  BenefitTitle,
  BenefitDescription,
  BenefitOverlay,
  MapLegend,
  LegendItem,
  MOUContent,
  MOUTitle,
  MOUText
} from '../styles/Resources.styles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Resources = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)
  
  // MOU 도시 데이터 (예시)
  const mouCities = [
    {
      id: 1,
      name: "서울, 한국",
      position: { top: "35%", left: "85%" },
      year: "2020"
    },
    {
      id: 2,
      name: "도쿄, 일본",
      position: { top: "32%", left: "88%" },
      year: "2021"
    },
    {
      id: 3,
      name: "시드니, 호주",
      position: { top: "70%", left: "90%" },
      year: "2022"
    },
    {
      id: 4,
      name: "런던, 영국",
      position: { top: "25%", left: "48%" },
      year: "2023"
    },
    {
      id: 5,
      name: "토론토, 캐나다",
      position: { top: "22%", left: "25%" },
      year: "2023"
    }
  ];

  // 회원혜택 데이터 (예시)
  const benefitData = [
    {
      id: 1,
      title: "글로벌 네트워킹",
      description: "전세계 OKTA 회원들과의 비즈니스 네트워킹 기회",
      image: "/images/benefit-networking.jpg",
      url: "https://www.okta.org/networking"
    },
    {
      id: 2,
      title: "교육 프로그램",
      description: "비즈니스 스킬 향상을 위한 전문 교육 과정",
      image: "/images/benefit-education.jpg",
      url: "https://www.okta.org/education"
    },
    {
      id: 3,
      title: "멘토링 서비스",
      description: "경험 많은 선배 기업인들의 1:1 멘토링",
      image: "/images/benefit-mentoring.jpg",
      url: "https://www.okta.org/mentoring"
    },
    {
      id: 4,
      title: "투자 기회",
      description: "스타트업 투자 및 비즈니스 파트너십 기회",
      image: "/images/benefit-investment.jpg",
      url: "https://www.okta.org/investment"
    },
    {
      id: 5,
      title: "세미나 & 컨퍼런스",
      description: "업계 전문가들의 최신 트렌드 세미나 참여",
      image: "/images/benefit-seminar.jpg",
      url: "https://www.okta.org/events"
    },
    {
      id: 6,
      title: "비즈니스 매칭",
      description: "업종별 비즈니스 파트너 매칭 서비스",
      image: "/images/benefit-matching.jpg",
      url: "https://www.okta.org/matching"
    }
  ];

  const handleBenefitClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <AboutContainer>
      <Title>자료실</Title>
      
      {/* MOU 섹션 */}
      <Section>
        <SectionTitle>MOU란 무엇인가요?</SectionTitle>
        <MOUSection>
          <MOUContent>
            <MOUTitle>MOU (Memorandum of Understanding)</MOUTitle>
            <MOUText>
              MOU는 양해각서(Memorandum of Understanding)의 줄임말로, 두 개 이상의 당사자 간에 
              상호 이해와 협력을 위한 기본적인 합의사항을 문서화한 것입니다.
            </MOUText>
            <MOUText>
              OKTA 덴버지회는 전세계 주요 도시의 한인 경제인 단체들과 MOU를 체결하여 
              글로벌 비즈니스 네트워크를 구축하고 있습니다. 이를 통해 회원들에게 다음과 같은 혜택을 제공합니다:
            </MOUText>
            <ul style={{ marginLeft: '2rem', lineHeight: '1.8', color: '#555' }}>
              <li>국제 비즈니스 기회 확대</li>
              <li>글로벌 파트너십 구축 지원</li>
              <li>해외 진출 컨설팅 서비스</li>
              <li>국제 교류 프로그램 참여</li>
              <li>글로벌 시장 정보 공유</li>
            </ul>
          </MOUContent>
          
          <WorldMapContainer>
            <WorldMapImage src="/images/world-map.png" alt="세계지도" />
            {mouCities.map((city) => (
              <CityPoint 
                key={city.id} 
                style={{ 
                  top: city.position.top, 
                  left: city.position.left 
                }}
              >
                <div className="pulse-dot"></div>
                <CityLabel>
                  <strong>{city.name}</strong>
                  <span>MOU 체결: {city.year}</span>
                </CityLabel>
              </CityPoint>
            ))}
            <CityPoint 
              style={{ top: "40%", left: "20%" }}
              className="denver-point"
            >
              <div className="main-dot"></div>
              <CityLabel className="denver-label">
                <strong>Denver, USA</strong>
                <span>본부</span>
              </CityLabel>
            </CityPoint>
          </WorldMapContainer>
          
          <MapLegend>
            <LegendItem>
              <div className="legend-dot main"></div>
              <span>OKTA 덴버지회 (본부)</span>
            </LegendItem>
            <LegendItem>
              <div className="legend-dot partner"></div>
              <span>MOU 체결 도시</span>
            </LegendItem>
          </MapLegend>
        </MOUSection>
      </Section>

      {/* 회원혜택 섹션 */}
      <Section>
        <SectionTitle>회원혜택</SectionTitle>
        <BenefitsGrid>
          {benefitData.map((benefit) => (
            <BenefitCard 
              key={benefit.id}
              onClick={() => handleBenefitClick(benefit.url)}
            >
              <BenefitImage src={benefit.image} alt={benefit.title} />
              <BenefitOverlay>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
                <span className="click-indicator">클릭하여 자세히 보기 →</span>
              </BenefitOverlay>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Section>
    </AboutContainer>
  );
};

export default Resources;
