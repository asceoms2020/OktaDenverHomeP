import React from 'react';
import {
  ResourcesContainer,
  Title,
  Section,
  SectionTitle,
  MOUSection,
  MOUContent,
  BenefitsList,
  BenefitItem,
  WorldMapContainer
} from '../styles/Resources.styles';

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

  return (
    <ResourcesContainer>
      <Title>{t.title}</Title>
      
      {/* MOU 섹션 */}
      <Section>
        <SectionTitle>{t.mouTitle}</SectionTitle>
        <MOUSection>
          <MOUContent>
            <h3>{t.mouContent.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: t.mouContent.description }} />
            <BenefitsList>
              {t.mouContent.benefits.map((benefit, index) => (
                <BenefitItem key={index}>{benefit}</BenefitItem>
              ))}
            </BenefitsList>
          </MOUContent>
          
          <WorldMapContainer>
            <img src={mouMapImage} alt={mapAltText} />
          </WorldMapContainer>
        </MOUSection>
      </Section>
    </ResourcesContainer>
  );
};

export default Resources;
