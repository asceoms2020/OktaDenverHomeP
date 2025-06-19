import React from 'react';
import {
  AboutContainer,
  Title,
  Section,
  SectionTitle
} from '../styles/About.styles';
import {
  EventsContainer,
  EventCard,
  EventPoster,
  EventOverlay,
  EventTitle,
  EventDate,
  EventDescription,
  EventButton,
  EventsGrid,
  UpcomingSection,
  PastSection,
  ZeffyButton,
  ZeffySection,
  EventBadge,
  ClickIndicator,
  PosterContainer
} from '../styles/Events.styles';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Events = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)

  // 다가오는 이벤트 데이터
  const upcomingEvents = [
    {
      id: 1,
      title: "Discover Korea at Dragon Boat Festival",
      date: "2024.06.15",
      description: "콜로라도 드래곤 보트 페스티벌에서 한국 문화를 소개하는 특별한 기회입니다.",
      poster: "/images/dragon-boat-event.jpg",
      url: "https://www.cdbf.org",
      badge: "참가 모집중"
    },
    {
      id: 2,
      title: "제 4회 OKTA 덴버 금융 세미나",
      date: "2024.07.20",
      description: "최신 금융 트렌드와 투자 전략에 대한 전문가 세미나입니다.",
      poster: "/images/seminar-4th-poster.jpg",
      url: null,
      badge: "곧 개최"
    }
  ];

  // 과거 이벤트 데이터
  const pastEvents = [
    {
      id: 1,
      title: "제 3회 OKTA 덴버 금융 세미나",
      date: "2023.11.18",
      description: "부동산 투자와 세금 전략",
      poster: "/images/seminar-3rd-poster.jpg"
    },
    {
      id: 2,
      title: "제 2회 OKTA 덴버 금융 세미나",
      date: "2023.07.15",
      description: "스타트업 투자와 벤처 캐피털",
      poster: "/images/seminar-2nd-poster.jpg"
    },
    {
      id: 3,
      title: "제 1회 OKTA 덴버 금융 세미나",
      date: "2023.03.25",
      description: "글로벌 경제 전망과 투자 기회",
      poster: "/images/seminar-1st-poster.jpg"
    },
    {
      id: 4,
      title: "OKTA 덴버 창립 행사",
      date: "2022.12.10",
      description: "덴버지회 공식 출범식",
      poster: "/images/founding-event-poster.jpg"
    }
  ];

  const handleEventClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleZeffyClick = () => {
    window.open('https://www.zeffy.com', '_blank');
  };

  return (
    <AboutContainer>
      <Title>이벤트</Title>
      
      {/* 다가오는 이벤트 섹션 */}
      <UpcomingSection>
        <SectionTitle>다가오는 이벤트</SectionTitle>
        <EventsGrid>
          {upcomingEvents.map((event) => (
            <EventCard 
              key={event.id}
              onClick={() => handleEventClick(event.url)}
              clickable={!!event.url}
            >
              {event.badge && <EventBadge>{event.badge}</EventBadge>}
              <PosterContainer>
                <EventPoster src={event.poster} alt={event.title} />
                <EventOverlay>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDate>{event.date}</EventDate>
                  <EventDescription>{event.description}</EventDescription>
                  {event.url && (
                    <ClickIndicator>클릭하여 자세히 보기 →</ClickIndicator>
                  )}
                </EventOverlay>
              </PosterContainer>
            </EventCard>
          ))}
        </EventsGrid>
      </UpcomingSection>

      {/* Zeffy 등록 섹션 */}
      <ZeffySection>
        <h3>이벤트 등록하기</h3>
        <p>OKTA 덴버지회의 다양한 이벤트에 참여하세요!</p>
        <ZeffyButton onClick={handleZeffyClick}>
          Zeffy에서 이벤트 등록하기
        </ZeffyButton>
      </ZeffySection>

      {/* 과거 이벤트 섹션 */}
      <PastSection>
        <SectionTitle>지난 이벤트</SectionTitle>
        <EventsGrid>
          {pastEvents.map((event) => (
            <EventCard key={event.id}>
              <PosterContainer>
                <EventPoster src={event.poster} alt={event.title} />
                <EventOverlay className="past-event">
                  <EventTitle>{event.title}</EventTitle>
                  <EventDate>{event.date}</EventDate>
                  <EventDescription>{event.description}</EventDescription>
                </EventOverlay>
              </PosterContainer>
            </EventCard>
          ))}
        </EventsGrid>
      </PastSection>
    </AboutContainer>
  );
};

export default Events; 