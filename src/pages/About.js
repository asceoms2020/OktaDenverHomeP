import React, { useEffect, useState } from 'react';
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
  BoardAvatar,
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

import {
  fetchAboutContent,
  getPublicUrlForPath,
  pickLocalized,
} from '../services/aboutPeople';

const About = () => {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.ko.about;

  const [dbCeo, setDbCeo] = useState(null);
  const [dbBoard, setDbBoard] = useState([]);
  
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

  const getInitials = (name = '') => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    if (/\s/.test(trimmed)) {
      return trimmed
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    // For names without spaces (e.g., Korean), show last two chars if possible
    return trimmed.length <= 2 ? trimmed : trimmed.slice(-2);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const { ceo, board } = await fetchAboutContent();
        if (!isMounted) return;
        setDbCeo(ceo);
        setDbBoard(board || []);
      } catch (e) {
        console.error('Failed to load About content:', e);
        if (!isMounted) return;
        setDbCeo(null);
        setDbBoard([]);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasDbCeo = !!dbCeo;
  const hasDbBoard = (dbBoard?.length || 0) > 0;

  const ceoIsVisible = dbCeo && dbCeo.is_active !== false;
  const boardVisible = (dbBoard || []).filter((m) => m.is_active !== false);

  const ceoName = dbCeo ? pickLocalized(language, dbCeo.name_ko, dbCeo.name_en) : '';
  const ceoGreeting = dbCeo ? pickLocalized(language, dbCeo.greeting_ko, dbCeo.greeting_en) : '';
  const ceoSignature = dbCeo ? pickLocalized(language, dbCeo.signature_ko, dbCeo.signature_en) : '';
  const ceoPhotoSrc = dbCeo
    ? (dbCeo.photo_url || getPublicUrlForPath(dbCeo.photo_path))
    : '';
  
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
      {hasDbCeo ? (
        ceoIsVisible ? (
          <Section>
            <SectionTitle>{t.ceoMessage.title}</SectionTitle>
            <CEOSection>
              <CEOImage
                src={ceoPhotoSrc || imageMap['jkc.png']}
                alt={ceoName || t.ceoMessage.name || 'CEO'}
              />
              <CEOMessage>
                <h3>{ceoName || t.ceoMessage.name}</h3>
                <p>{ceoGreeting || t.ceoMessage.greeting}</p>
                {(ceoSignature || t.ceoMessage.signature) && (
                  <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                    {ceoSignature || t.ceoMessage.signature}
                  </p>
                )}
              </CEOMessage>
            </CEOSection>
          </Section>
        ) : null
      ) : (
        <Section>
          <SectionTitle>{t.ceoMessage.title}</SectionTitle>
          <CEOSection>
            <CEOImage src={imageMap['jkc.png']} alt="회장님" />
            <CEOMessage>
              <h3>{t.ceoMessage.name}</h3>
              <p>{t.ceoMessage.greeting}</p>
              <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                {t.ceoMessage.signature}
              </p>
            </CEOMessage>
          </CEOSection>
        </Section>
      )}

      {/* 보드멤버 */}
      <Section>
        <SectionTitle>{t.boardMembers.title}</SectionTitle>
        <BoardSection>
          <BoardGrid>
            {hasDbBoard
               ? boardVisible.map((member) => {
                   const name = pickLocalized(language, member.name_ko, member.name_en);
                   const position = pickLocalized(language, member.position_ko, member.position_en);
                   const photo = member.photo_url || getPublicUrlForPath(member.photo_path);

                  return (
                    <BoardMember key={member.id}>
                      {photo ? (
                        <BoardImage src={photo} alt={position || name} />
                      ) : (
                        <BoardAvatar aria-label={name}>
                          {getInitials(name)}
                        </BoardAvatar>
                      )}
                      <BoardName>{name}</BoardName>
                      <BoardPosition>{position}</BoardPosition>
                    </BoardMember>
                  );
                })
              : t.boardMembers.members.map((member, index) => (
                  <BoardMember key={index}>
                    {member.image && imageMap[member.image] ? (
                      <BoardImage src={imageMap[member.image]} alt={member.position} />
                    ) : (
                      <BoardAvatar aria-label={member.name}>
                        {getInitials(member.name)}
                      </BoardAvatar>
                    )}
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
