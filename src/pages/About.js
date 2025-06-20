import React from 'react';
import {
  AboutContainer,
  Title,
  Content,
  Section,
  SectionTitle,
  ImageGrid,
  ImageContainer,
  Image,
  ImageCaption,
  CEOSection,
  CEOImage,
  CEOMessage,
  BoardSection,
  BoardGrid,
  BoardMember,
  BoardImage,
  BoardName,
  BoardPosition,
  OrgChart,
  OrgLevel,
  OrgBox,
  ServiceGrid,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  Timeline,
  TimelineItem,
  TimelineYear,
  TimelineContent
} from '../styles/About.styles';

import ceoPhoto from '../assets/images/ceo-photo.jpg';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const About = () => {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.ko.about;
  
  // 번역 데이터가 로드되지 않았을 때 로딩 상태 표시
  if (!t) {
    return <div>Loading...</div>;
  }
  
  return (
    <AboutContainer>
      <Title>{t.title}</Title>
      
      {/* 회사 소개 */}
      <Content>
        <p>
          {t.companyIntro}
        </p>
      </Content>

      {/* 회장님 인사말 */}
      <Section>
        <SectionTitle>{t.ceoMessage.title}</SectionTitle>
        <CEOSection>
          <CEOImage src={ceoPhoto} alt="회장님" />
          <CEOMessage>
            <h3>{t.ceoMessage.name}</h3>
            <p>
              {t.ceoMessage.greeting}
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
              {t.ceoMessage.signature}
            </p>
          </CEOMessage>
        </CEOSection>
      </Section>

      {/* 보드멤버 */}
      <Section>
        <SectionTitle>{t.boardMembers.title}</SectionTitle>
        <BoardSection>
          <BoardGrid>
            {t.boardMembers.members.map((member, index) => (
              <BoardMember key={index}>
                <BoardImage src={`/images/board${index + 1}.jpg`} alt={member.position} />
                <BoardName>{member.name}</BoardName>
                <BoardPosition>{member.position}</BoardPosition>
              </BoardMember>
            ))}
          </BoardGrid>
        </BoardSection>
      </Section>
      
      {/* 하는 일 */}
      <Section>
        <SectionTitle>{t.services.title}</SectionTitle>
        <ServiceGrid>
          {t.services.items.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{['🔐', '🛡️', '🌐', '📊'][index]}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>
                {service.description}
              </ServiceDescription>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      {/* History */}
      <Section>
        <SectionTitle>{t.history.title}</SectionTitle>
        <Timeline>
          {t.history.items.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineYear>{item.year}</TimelineYear>
              <TimelineContent>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {/* 사무실 이미지 */}
      <Section>
        <SectionTitle>{t.gallery.title}</SectionTitle>
        <ImageGrid>
          {t.gallery.captions.map((caption, index) => (
            <ImageContainer key={index}>
              <Image 
                src={`/images/${['denver-office1', 'denver-team', 'denver-culture'][index]}.jpg`} 
                alt={caption} 
              />
              <ImageCaption>{caption}</ImageCaption>
            </ImageContainer>
          ))}
        </ImageGrid>
      </Section>
    </AboutContainer>
  );
};

export default About; 