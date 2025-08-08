import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle,
  ServiceGrid,
  Content
} from '../styles/About.styles';
import './Resources.css';
// MOU 지도 이미지들 import
import mouKorImage from '../assets/images/source/mou_kor.png';
import mouEngImage from '../assets/images/source/mou_eng.png';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Resources = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)
  
  // 언어에 따른 MOU 지도 이미지 선택
  const mouMapImage = language === 'ko' ? mouKorImage : mouEngImage;
  const mapAltText = language === 'ko' ? '세계지도' : 'World Map';

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
    <div className="resources-container">
      <Title>자료실</Title>
      
      {/* MOU 섹션 */}
      <Section>
        <SectionTitle>MOU란 무엇인가요?</SectionTitle>
        <div className="mou-section">
          <div className="mou-content">
            <h3 className="mou-title">MOU (Memorandum of Understanding)</h3>
            <p className="mou-text">
              MOU는 양해각서(Memorandum of Understanding)의 줄임말로, 두 개 이상의 당사자 간에 
              상호 이해와 협력을 위한 기본적인 합의사항을 문서화한 것입니다.
            </p>
            <p className="mou-text">
              세계한인무역협회(World-OKTA) 덴버 지회는 상호 협조 및 발전에 기여하고, 관심 사업과 정보 교류 및 협력 증진을 도모하기 위해 세계 여러 지회와 업무제휴 양해각서(MOU)를 체결하고 늘려가고 있습니다.
            </p>
            <ul className="mou-benefits">
              <li>국제 비즈니스 기회 확대</li>
              <li>글로벌 파트너십 구축 지원</li>
              <li>해외 진출 컨설팅 서비스</li>
              <li>국제 교류 프로그램 참여</li>
              <li>글로벌 시장 정보 공유</li>
            </ul>
          </div>
          
          <div className="world-map-container">
            <img src={mouMapImage} alt={mapAltText} className="world-map-image" />
          </div>
        </div>
      </Section>

      {/* 회원혜택 섹션 */}
      <Section>
        <SectionTitle>회원혜택</SectionTitle>
        <div className="benefits-grid">
          {benefitData.map((benefit) => (
            <div 
              key={benefit.id}
              className="benefit-card"
              onClick={() => handleBenefitClick(benefit.url)}
            >
              <img src={benefit.image} alt={benefit.title} className="benefit-image" />
              <div className="benefit-overlay">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
                <span className="click-indicator">클릭하여 자세히 보기 →</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Resources;
