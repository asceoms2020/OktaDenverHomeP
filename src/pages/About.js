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

import jkc from '../assets/images/about/jkc.png';
import swl from '../assets/images/about/swl.png';
import syk from '../assets/images/about/syk.png';
import dys from '../assets/images/about/dys.png';
import sjp from '../assets/images/about/sjp.jpg';
import yjs from '../assets/images/about/yjs.png';

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const About = () => {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.ko.about;
  
  // 이미지 매핑 객체
  const imageMap = {
    'jkc.png': jkc,
    'sjp.jpg': sjp,
    'syk.png': syk,
    'swl.png': swl,
    'dys.png': dys,
    'yjs.png': yjs
  };
  
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
          <CEOImage src={imageMap['jkc.png']} alt="회장님" />
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
                <BoardImage src={imageMap[member.image]} alt={member.position} />
                <BoardName>{member.name}</BoardName>
                <BoardPosition>{member.position}</BoardPosition>
              </BoardMember>
            ))}
          </BoardGrid>
        </BoardSection>
      </Section>
      
      {/* 하는 일 */}
      {/* <Section>
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
      </Section> */}


    </AboutContainer>
  );
};

export default About; 