import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle
} from '../styles/About.styles';
import {
  SponsorsContainer,
  SponsorCard,
  SponsorLogo,
  SponsorContent,
  SponsorName,
  SponsorCategory,
  SponsorDescription,
  SponsorWebsite,
  SponsorsGrid,
  PremiumSection,
  RegularSection,
  SponsorBadge,
  ContactInfo,
  ClickIndicator,
  LogoContainer,
  CompanyInfo
} from '../styles/Sponsors.styles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Sponsors = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)

  // 프리미엄 스폰서 (주요 회원사)
  const premiumSponsors = [
    {
      id: 1,
      name: "Denver Korean Market",
      category: "식품 유통",
      description: "덴버 지역 최대 규모의 한국 식품 마켓으로, 신선한 한국 식재료와 생활용품을 제공합니다. 20년간 한인 커뮤니티의 든든한 동반자로 함께해왔습니다.",
      logo: "/images/sponsors/denver-korean-market-logo.png",
      website: "https://www.denverkoreanmarket.com",
      badge: "Premium Partner",
      contact: "303-123-4567"
    },
    {
      id: 2,
      name: "Mountain View Financial",
      category: "금융 서비스",
      description: "한인 커뮤니티를 위한 전문 금융 컨설팅 서비스를 제공합니다. 투자, 보험, 세금 상담까지 원스톱 금융 솔루션을 경험하세요.",
      logo: "/images/sponsors/mountain-view-financial-logo.png",
      website: "https://www.mvfinancial.com",
      badge: "Premium Partner",
      contact: "303-234-5678"
    }
  ];

  // 일반 스폰서 (회원사들)
  const regularSponsors = [
    {
      id: 3,
      name: "K-Beauty Denver",
      category: "뷰티 & 화장품",
      description: "최신 K-뷰티 제품과 전문 피부 관리 서비스를 제공하는 뷰티 전문점입니다.",
      logo: "/images/sponsors/k-beauty-logo.png",
      website: "https://www.kbeautydenver.com",
      contact: "303-345-6789"
    },
    {
      id: 4,
      name: "Seoul Kitchen",
      category: "한식당",
      description: "정통 한국 요리와 현대적 감각이 어우러진 프리미엄 한식당입니다.",
      logo: "/images/sponsors/seoul-kitchen-logo.png",
      website: "https://www.seoulkitchen.com",
      contact: "303-456-7890"
    },
    {
      id: 5,
      name: "Denver Taekwondo Academy",
      category: "교육 & 스포츠",
      description: "전통 태권도와 현대 무술을 가르치는 무도관으로 건강한 몸과 마음을 기릅니다.",
      logo: "/images/sponsors/taekwondo-logo.png",
      website: "https://www.denvertkd.com",
      contact: "303-567-8901"
    },
    {
      id: 6,
      name: "Mile High Tech Solutions",
      category: "IT & 기술",
      description: "소프트웨어 개발, 웹사이트 제작, IT 컨설팅 서비스를 제공하는 기술 전문 업체입니다.",
      logo: "/images/sponsors/miletech-logo.png",
      website: "https://www.milehightech.com",
      contact: "303-678-9012"
    },
    {
      id: 7,
      name: "Rocky Mountain Realty",
      category: "부동산",
      description: "덴버 지역 부동산 전문가로 주택 매매, 임대, 투자 상담을 제공합니다.",
      logo: "/images/sponsors/rocky-realty-logo.png",
      website: "https://www.rockymountainrealty.com",
      contact: "303-789-0123"
    },
    {
      id: 8,
      name: "Arirang Auto Service",
      category: "자동차 서비스",
      description: "신뢰할 수 있는 자동차 정비 및 관리 서비스를 제공하는 전문 정비소입니다.",
      logo: "/images/sponsors/arirang-auto-logo.png",
      website: "https://www.arirangauto.com",
      contact: "303-890-1234"
    }
  ];

  const handleSponsorClick = (website) => {
    window.open(website, '_blank');
  };

  return (
    <AboutContainer>
      <Title>후원사</Title>
      
      {/* 프리미엄 파트너 섹션 */}
      <PremiumSection>
        <SectionTitle>Premium Partners</SectionTitle>
        <SponsorsGrid premium>
          {premiumSponsors.map((sponsor) => (
            <SponsorCard 
              key={sponsor.id} 
              premium
              onClick={() => handleSponsorClick(sponsor.website)}
            >
              {sponsor.badge && <SponsorBadge premium>{sponsor.badge}</SponsorBadge>}
              <LogoContainer premium>
                <SponsorLogo src={sponsor.logo} alt={sponsor.name} />
              </LogoContainer>
              <SponsorContent premium>
                <CompanyInfo>
                  <SponsorName premium>{sponsor.name}</SponsorName>
                  <SponsorCategory>{sponsor.category}</SponsorCategory>
                </CompanyInfo>
                <SponsorDescription premium>{sponsor.description}</SponsorDescription>
                <ContactInfo>
                  <span>📞 {sponsor.contact}</span>
                  <SponsorWebsite>{sponsor.website}</SponsorWebsite>
                </ContactInfo>
                <ClickIndicator>클릭하여 홈페이지 방문 →</ClickIndicator>
              </SponsorContent>
            </SponsorCard>
          ))}
        </SponsorsGrid>
      </PremiumSection>

      {/* 일반 회원사 섹션 */}
      <RegularSection>
        <SectionTitle>Member Companies</SectionTitle>
        <SponsorsGrid>
          {regularSponsors.map((sponsor) => (
            <SponsorCard 
              key={sponsor.id}
              onClick={() => handleSponsorClick(sponsor.website)}
            >
              <LogoContainer>
                <SponsorLogo src={sponsor.logo} alt={sponsor.name} />
              </LogoContainer>
              <SponsorContent>
                <CompanyInfo>
                  <SponsorName>{sponsor.name}</SponsorName>
                  <SponsorCategory>{sponsor.category}</SponsorCategory>
                </CompanyInfo>
                <SponsorDescription>{sponsor.description}</SponsorDescription>
                <ContactInfo>
                  <span>📞 {sponsor.contact}</span>
                  <SponsorWebsite>{sponsor.website}</SponsorWebsite>
                </ContactInfo>
                <ClickIndicator>클릭하여 홈페이지 방문 →</ClickIndicator>
              </SponsorContent>
            </SponsorCard>
          ))}
        </SponsorsGrid>
      </RegularSection>

      {/* 후원사 모집 안내 */}
      <Section>
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
            후원사가 되어주세요!
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#555',
            lineHeight: '1.7',
            marginBottom: '2rem'
          }}>
            OKTA 덴버지회와 함께 한인 커뮤니티의 발전에 기여하고,<br/>
            비즈니스 네트워킹의 기회를 넓혀보세요.
          </p>
          <button
            style={{
              background: 'linear-gradient(45deg, #3498db, #2ecc71)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            후원사 문의하기
          </button>
        </div>
      </Section>
    </AboutContainer>
  );
};

export default Sponsors;
