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
  const t = translations[language]?.resources || translations.ko.resources;
  
  if (!t) return null;

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
      <Title>{t.title}</Title>
      
      {/* MOU 섹션 */}
      <Section>
        <SectionTitle>{t.mouTitle}</SectionTitle>
        <div className="mou-section">
          <div className="mou-content">
            <h3 className="mou-title">{t.mouContent.title}</h3>
            <p className="mou-text" dangerouslySetInnerHTML={{ __html: t.mouContent.description }} />
            <ul className="mou-benefits">
              {t.mouContent.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="world-map-container">
            <img src={mouMapImage} alt={mapAltText} className="world-map-image" />
          </div>
        </div>
      </Section>

      {/* 회원혜택 섹션 */}
      {/* <Section>
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
      </Section> */}
    </div>
  );
};

export default Resources;
