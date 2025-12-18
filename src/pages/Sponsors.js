import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle
} from '../styles/About.styles';
import {
  SponsorsContainer,
  SponsorsGrid,
  PremiumSection,
  RegularSection,
  RecruitmentSection,
  ContactButton,
  EmptySlot
} from '../styles/Sponsors.styles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Sponsors = () => {
  const { language } = useLanguage();
  const t = translations[language]?.sponsors || translations.ko.sponsors;
  
  if (!t) return null;

  // Create 6 empty slots for demonstration
  const emptySlots = Array(6).fill(null);

  const handleRecruitmentClick = () => {
    window.location.href = "mailto:info@oktadenver.org";
  };

  return (
    <SponsorsContainer>
      <Title>{t.title}</Title>
      
      {/* 프리미엄 파트너 섹션 */}
      <PremiumSection>
        <SectionTitle>{t.premiumTitle}</SectionTitle>
        <SponsorsGrid premium>
          {/* Currently empty - waiting for sponsors */}
          {Array(3).fill(null).map((_, index) => (
             <EmptySlot key={`premium-${index}`}>
               <span>{t.premiumPartner}</span>
               <small>{t.availableSpot}</small>
             </EmptySlot>
          ))}
        </SponsorsGrid>
      </PremiumSection>

      {/* 일반 회원사 섹션 */}
      <RegularSection>
        <SectionTitle>{t.memberTitle}</SectionTitle>
        <SponsorsGrid>
          {emptySlots.map((_, index) => (
            <EmptySlot key={`regular-${index}`}>
              <span>{t.memberCompany}</span>
              <small>{t.availableSpot}</small>
            </EmptySlot>
          ))}
        </SponsorsGrid>
      </RegularSection>

      {/* 후원사 모집 안내 */}
      <RecruitmentSection>
          <h3>{t.recruitment.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: t.recruitment.description }} />
          <ContactButton
            onClick={handleRecruitmentClick}
          >
            {t.recruitment.button}
          </ContactButton>
      </RecruitmentSection>
    </SponsorsContainer>
  );
};

export default Sponsors;
