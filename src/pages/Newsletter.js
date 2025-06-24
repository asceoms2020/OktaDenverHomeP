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
import webzine1 from '../assets/images/newletter/webzine/17th-webzine.jpg';
import webzine2 from '../assets/images/newletter/webzine/16th-webzine.jpg';
import webzine3 from '../assets/images/newletter/webzine/15th-webzine.jpg';


const Newsletter = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)
  
  // 웹진 클릭 핸들러
  const handleWebzineClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // 예시 데이터
  const webzineData = [
    {
      id: 1,
      title: "월드옥타 웹진 17호",
      excerpt: "",
      date: "05.25.2025",
      image: webzine1,
      url: "https://book.litchi.biz/books/pggb/mobile/index.html", // 
      category: ""
    },
    {
      id: 2,
      title: "월드옥타 웹진 16호",
      excerpt: "",
      date: "04.25.2025",
      image: webzine2,
      url: "https://book.yunzhan365.com/bavku/howc/mobile/index.html", // 실제 URL로 변경 필요
      category: ""
    },
    {
      id: 3,
      title: "월드옥타 웹진 15호",
      excerpt: "",
      date: "03.25.2025",
      image: webzine3,
      url: "https://book.litchi.biz/books/galf/mobile/index.html", // 실제 URL로 변경 필요
      category: ""
    }
  ];

  const newsData = [
    {
      id: 1,
      title: "미국 연방정부, 새로운 사이버보안 가이드라인 발표",
      summary: "미국 국토보안부가 중요 인프라 보호를 위한 새로운 사이버보안 가이드라인을 발표했습니다. 전력, 금융, 의료 등 핵심 분야의 보안 강화가 주요 내용입니다.",
      date: "2024.03.20",
      source: "Reuters",
      category: "정책"
    },
    {
      id: 2,
      title: "유럽연합, AI 규제법안 최종 승인",
      summary: "EU 의회가 인공지능 기술의 안전한 사용을 위한 포괄적인 규제 법안을 승인했습니다. 고위험 AI 시스템에 대한 엄격한 규제가 포함되어 있습니다.",
      date: "2024.03.18",
      source: "BBC News",
      category: "규제"
    },
    {
      id: 3,
      title: "글로벌 랜섬웨어 공격 급증, 피해액 사상 최대",
      summary: "올해 1분기 글로벌 랜섬웨어 공격이 전년 동기 대비 70% 증가했으며, 피해액도 역대 최고치를 기록했다고 보안 업체들이 발표했습니다.",
      date: "2024.03.15",
      source: "CNN",
      category: "위협"
    }
  ];

  const eventData = [
    {
      id: 1,
      title: "2023 연말 보안 컨퍼런스",
      date: "2023.12.15",
      image: "/images/event1.jpg",
      description: "업계 전문가들과 함께한 보안 트렌드 논의"
    },
    {
      id: 2,
      title: "고객사 보안 교육 세미나",
      date: "2023.11.20",
      image: "/images/event2.jpg",
      description: "임직원 대상 보안 인식 제고 교육"
    },
    {
      id: 3,
      title: "덴버 사무소 개소식",
      date: "2023.10.10",
      image: "/images/event3.jpg",
      description: "미국 덴버 지사 공식 개소"
    },
    {
      id: 4,
      title: "사이버보안 워크샵",
      date: "2023.09.25",
      image: "/images/event4.jpg",
      description: "실무진 대상 보안 기술 워크샵"
    }
  ];

  return (
    <AboutContainer>
      <Title>뉴스레터</Title>
      
      {/* 웹진 섹션 */}
      <Section>
        <SectionTitle>웹진</SectionTitle>
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
                <WebzineTitle>{webzine.title}</WebzineTitle>
                <WebzineExcerpt>{webzine.excerpt}</WebzineExcerpt>
                <ReadMoreBtn 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWebzineClick(webzine.url);
                  }}
                >
                  자세히 보기
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
            📚 더 많은 웹진 보기
          </ViewMoreWebzineBtn>
        </ViewMoreSection>
      </Section>

      {/* 뉴스 섹션 */}
      <Section>
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
      </Section>
    </AboutContainer>
  );
};

export default Newsletter; 