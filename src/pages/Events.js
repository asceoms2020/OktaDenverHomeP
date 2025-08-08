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
import pastEvent1Poster from '../assets/images/event/pastevent1.png';
import pastEvent2Poster from '../assets/images/event/pastevent2.png'; 
import pastEvent3Poster from '../assets/images/event/pastevent3.png';
import pastEvent4Poster from '../assets/images/event/pastevent4.png';
import pastEvent5Poster from '../assets/images/event/pastevent5.png';

const Events = () => {
  const { language } = useLanguage();
  const t = translations[language]?.events || translations.ko.events;
  
  // 디버깅: 현재 언어와 번역 데이터 확인
  console.log('Current language:', language);
  console.log('Events translations:', t);
  
  // 언어별 기본값 설정
  const defaultTexts = {
    ko: {
      title: "이벤트",
      upcomingEvents: "다가오는 이벤트", 
      pastEvents: "지난 이벤트",
      clickToView: "클릭하여 자세히 보기 →",
      upcomingEvent1: {
        title: "Discover Korea at Dragon Boat Festival",
        description: "콜로라도 드래곤 보트 페스티벌에서 한국 문화를 소개하는 특별한 기회입니다.",
        badge: "참가 모집중"
      }
    },
    en: {
      title: "Events",
      upcomingEvents: "Upcoming Events",
      pastEvents: "Past Events", 
      clickToView: "Click to view details →",
      upcomingEvent1: {
        title: "Discover Korea at Dragon Boat Festival",
        description: "Special opportunity to introduce Korean culture at the Colorado Dragon Boat Festival.",
        badge: "Registration Open"
      }
    }
  };
  
  const defaults = defaultTexts[language] || defaultTexts.ko;

  // 다가오는 이벤트 데이터 (번역 적용)
  const upcomingEvents = [
    {
      id: 1,
      title: t?.upcomingEventsList?.[0]?.title || defaults.upcomingEvent1.title,
      date: "09.07.2025~09.08.2025",
      description: t?.upcomingEventsList?.[0]?.description || defaults.upcomingEvent1.description,
      poster: upcomingEvent1Poster,
      url: "https://www.cdbf.org",
      badge: t?.upcomingEventsList?.[0]?.badge || defaults.upcomingEvent1.badge
    }
  ];

  // 과거 이벤트 데이터 (번역 적용)
  const pastEvents = [
    {
      id: 1,
      title: t?.pastEventsList?.[0]?.title || "제 4회 OKTA 비즈니스 세미나",
      date: "06.28.2025",
      description: t?.pastEventsList?.[0]?.description || "최신 금융 트렌드와 투자 전략에 대한 전문가 세미나",
      poster: pastEvent5Poster,
      url: "https://www.zeffy.com/ticketing/3"
    },
    {
      id: 2,
      title: t?.pastEventsList?.[1]?.title || "제 3회 월드옥타 덴버 차세대 세미나",
      date: "11.23.2023",
      description: t?.pastEventsList?.[1]?.description || "차세대 리더십과 성장 전략에 대한 세미나",
      poster: pastEvent1Poster,
      url: null
    },
    {
      id: 3,
      title: t?.pastEventsList?.[2]?.title || "제 2회 월드옥타 덴버 차세대 세미나",
      date: "02.18.2023",
      description: t?.pastEventsList?.[2]?.description || "젊은 전문가들을 위한 네트워킹과 교육",
      poster: pastEvent2Poster,
      url: null
    },
    {
      id: 4,
      title: t?.pastEventsList?.[3]?.title || "디스커버 코리아(Discover Korea)",
      date: "06.29.2024 ~ 06.30.2024",
      description: t?.pastEventsList?.[3]?.description || "글로벌 경제 전망과 투자 기회",
      poster: pastEvent3Poster,
      url: null
    },
    {
      id: 5,
      title: t?.pastEventsList?.[4]?.title || "골프 토너먼트 (Golf Tournament)",
      date: "07.16.2024",
      description: t?.pastEventsList?.[4]?.description || "연례 골프 토너먼트 및 네트워킹 이벤트",
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
      <Title>{t?.title || defaults.title}</Title>
      
      {/* 다가오는 이벤트 섹션 */}
      <UpcomingSection>
        <SectionTitle>{t?.upcomingEvents || defaults.upcomingEvents}</SectionTitle>
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
                    <ClickIndicator>{t?.clickToView || defaults.clickToView}</ClickIndicator>
                  )}
                </EventOverlay>
              </PosterContainer>
            </EventCard>
          ))}
        </EventsGrid>
      </UpcomingSection>

      {/* Zeffy 등록 섹션 */}
      {/* <ZeffySection>
        <h3>{t.eventRegistration.title}</h3>
        <p>{t.eventRegistration.description}</p>
        <ZeffyButton onClick={handleZeffyClick}>
          {t.eventRegistration.buttonText}
        </ZeffyButton>
      </ZeffySection> */}

      {/* 과거 이벤트 섹션 */}
      <PastSection>
        <SectionTitle>{t?.pastEvents || defaults.pastEvents}</SectionTitle>
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
                    <ClickIndicator>{t?.clickToView || defaults.clickToView}</ClickIndicator>
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