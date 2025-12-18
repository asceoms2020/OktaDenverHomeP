import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle,
  ServiceGrid,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  ImageGrid,
  ImageContainer,
  Image,
  ImageCaption,
  Timeline,
  TimelineItem,
  TimelineYear,
  TimelineContent
} from '../styles/About.styles';
import {
  NewsletterContainer,
  WebzineCard,
  WebzineImage,
  WebzineContent,
  WebzineDate,
  WebzineTitle,
  WebzineExcerpt,
  NewsCard,
  NewsHeader,
  NewsTitle,
  NewsDate,
  NewsContent,
  NewsSummary,
  NewsSource,
  EventCard,
  EventImage,
  EventInfo,
  EventTitle,
  EventDate,
  ReadMoreBtn,
  ViewMoreSection,
  ViewMoreWebzineBtn
} from '../styles/Newsletter.styles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { webzineData } from '../data/webzineData';


const Newsletter = () => {
  const { language } = useLanguage();
  const t = translations[language]?.newsletterPage || translations.ko.newsletterPage;
  
  if (!t) return null;

  // 웹진 클릭 핸들러
  const handleWebzineClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <AboutContainer>
      <Title>{t.title}</Title>
      
      {/* 웹진 섹션 */}
      <Section>
        <SectionTitle>{t.webzineTitle}</SectionTitle>
        <ServiceGrid>
          {webzineData.map((webzine) => (
            <WebzineCard 
              key={webzine.id}
              onClick={() => handleWebzineClick(webzine.url)}
              style={{ cursor: webzine.url ? 'pointer' : 'default' }}
            >
              <WebzineImage src={webzine.image} alt={webzine.title} />
              <WebzineContent>
                <WebzineDate>{webzine.date}</WebzineDate>
                <WebzineTitle>{webzine.id === 1 ? t.webzine17 : webzine.id === 2 ? t.webzine16 : t.webzine15 }</WebzineTitle>
                <WebzineExcerpt>{webzine.excerpt}</WebzineExcerpt>
                <ReadMoreBtn 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWebzineClick(webzine.url);
                  }}
                >
                  {t.readMore}
                </ReadMoreBtn>
              </WebzineContent>
            </WebzineCard>
          ))}
        </ServiceGrid>
        
        {/* 더 많은 웹진 보기 버튼 */}
        <ViewMoreSection>
          <ViewMoreWebzineBtn 
            onClick={() => handleWebzineClick('https://www.okta.net/site/okta/page/activity/promotion/webzine/')}
          >
            {t.viewMore}
          </ViewMoreWebzineBtn>
        </ViewMoreSection>
      </Section>

      {/* 뉴스 섹션 */}
      {/* <Section>
        <SectionTitle>국제 정세 & 보안 뉴스</SectionTitle>
        <NewsletterContainer>
          {newsData.map((news) => (
            <NewsCard key={news.id}>
              <NewsHeader>
                <NewsDate>{news.date}</NewsDate>
                <NewsSource>{news.source}</NewsSource>
              </NewsHeader>
              <NewsTitle>{news.title}</NewsTitle>
              <NewsSummary>{news.summary}</NewsSummary>
              <ReadMoreBtn>전체 기사 보기</ReadMoreBtn>
            </NewsCard>
          ))}
        </NewsletterContainer>
      </Section> */}
    </AboutContainer>
  );
};

export default Newsletter; 