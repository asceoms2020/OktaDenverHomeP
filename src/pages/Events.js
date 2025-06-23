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

// 다가오는 이벤트 데이터 (export)
import upcomingEvent1Poster from '../assets/images/event/upcomingevent1.png';
import upcomingEvent2Poster from '../assets/images/event/upcomingevent2.png';
import pastEvent1Poster from '../assets/images/event/pastevent1.png';
import pastEvent2Poster from '../assets/images/event/pastevent2.png'; 
import pastEvent3Poster from '../assets/images/event/pastevent3.png';
import pastEvent4Poster from '../assets/images/event/pastevent4.png';

export const upcomingEvents = [
  {
    id: 1,
    title: "Discover Korea at Dragon Boat Festival",
    date: "09.27.2025",
    description: "콜로라도 드래곤 보트 페스티벌에서 한국 문화를 소개하는 특별한 기회입니다.",
    poster: upcomingEvent1Poster,
    url: "https://www.cdbf.org",
    badge: "참가 모집중"
  },
  {
    id: 2,
    title: "제 4회 OKTA 비즈니스 세미나",
    date: "06.28.2025",
    description: "최신 금융 트렌드와 투자 전략에 대한 전문가 세미나입니다.",
    poster: upcomingEvent2Poster,
    url: "https://www.zeffy.com/ticketing/3",
    badge: "곧 개최"
  }
];

const Events = () => {
  const { language } = useLanguage();
  // 임시로 한국어 사용 (나중에 translations에 추가)

  // 과거 이벤트 데이터
  const pastEvents = [
    {
      id: 1,
      title: "제 3회 월드옥타 덴버 차세대 세미나",
      date: "11.23.2023",
      description: "차세대 리더십과 성장 전략에 대한 세미나",
      poster: pastEvent1Poster,
      url: null // URL이 없는 경우
    },
    {
      id: 2,
      title: "제 2회 월드옥타 덴버 차세대 세미나",
      date: "02.18.2023",
      description: "젊은 전문가들을 위한 네트워킹과 교육",
      poster: pastEvent2Poster,
      url: null // URL이 없는 경우
    },
    {
      id: 3,
      title: "디스커버 코리아(Discover Korea)",
      date: "06.29.2024 ~ 06.30.2024",
      description: "글로벌 경제 전망과 투자 기회",
      poster: pastEvent3Poster,
      url: null // URL이 없는 경우
    },
    {
      id: 4,
      title: "골프 토너먼트 (Golf Tournament)",
      date: "07.16.2024",
      description: "연례 골프 토너먼트 및 네트워킹 이벤트",
      poster: pastEvent4Poster,
      url: "https://www.zeffy.com/en-US/ticketing/526bb733-8248-4987-be28-edd572e750c6"
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
      {/* <ZeffySection>
        <h3>이벤트 등록하기</h3>
        <p>OKTA 덴버지회의 다양한 이벤트에 참여하세요!</p>
        <ZeffyButton onClick={handleZeffyClick}>
          Zeffy에서 이벤트 등록하기
        </ZeffyButton>
      </ZeffySection> */}

      {/* 과거 이벤트 섹션 */}
      <PastSection>
        <SectionTitle>지난 이벤트</SectionTitle>
        <EventsGrid>
          {pastEvents.map((event) => (
            <EventCard 
              key={event.id}
              onClick={() => handleEventClick(event.url)}
              clickable={!!event.url}
            >
              <PosterContainer>
                <EventPoster src={event.poster} alt={event.title} />
                <EventOverlay className="past-event">
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
      </PastSection>
    </AboutContainer>
  );
};

export default Events; 