import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지들 import
import main1 from '../assets/images/main/main_1.jpg';
import main2 from '../assets/images/main/main_2.jpg';
import main3 from '../assets/images/main/main_3.jpg';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
// Events 스타일 컴포넌트들 import
import {
  EventsGrid,
  EventCard,
  EventPoster,
  EventOverlay,
  EventTitle,
  EventDate,
  EventDescription,
  ClickIndicator,
  PosterContainer,
  EventBadge
} from '../styles/Events.styles';
// Events 데이터 import
import upcomingEvent1Poster from '../assets/images/event/upcomingevent1.png';
import upcomingEvent2Poster from '../assets/images/event/upcomingevent2.png';

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language].home;
  const eventT = translations[language]?.events || translations.ko.events;

  // 슬라이더 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const backgroundImages = [main1, main2, main3];

  // 자동 슬라이딩 효과
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [backgroundImages.length]);

  // 다가오는 이벤트 데이터 (Home에서 사용)
  const upcomingEvents = [
    {
      id: 1,
      title: eventT?.upcomingEventsList?.[0]?.title || "Discover Korea at Dragon Boat Festival",
      date: "09.07.2025~09.08.2025",
      description: eventT?.upcomingEventsList?.[0]?.description || "콜로라도 드래곤 보트 페스티벌에서 한국 문화를 소개하는 특별한 기회입니다.",
      poster: upcomingEvent1Poster,
      url: "https://www.cdbf.org",
      badge: eventT?.upcomingEventsList?.[0]?.badge || "참가 모집중"
    },
    {
      id: 2,
      title: eventT?.upcomingEventsList?.[1]?.title || "제 4회 OKTA 비즈니스 세미나",
      date: "06.28.2025",
      description: eventT?.upcomingEventsList?.[1]?.description || "최신 금융 트렌드와 투자 전략에 대한 전문가 세미나입니다.",
      poster: upcomingEvent2Poster,
      url: "https://www.zeffy.com/ticketing/3",
      badge: eventT?.upcomingEventsList?.[1]?.badge || "곧 개최"
    }
  ];

  const handleProjectClick = (url) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url) {
      // 내부 라우트의 경우 Link 컴포넌트 사용하지 않고 직접 이동
      window.location.href = url;
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section hero-section-background">
        <div className="hero-slider">
          <div 
            className="slide-container" 
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {backgroundImages.map((image, index) => (
              <div 
                key={index} 
                className="slide"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})` }}
              />
            ))}
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-content-box">
            <h1 className="hero-title hero-title-white">{t.title}</h1>
            <p className="hero-subtitle hero-subtitle-white">
              {t.subtitle}
            </p>
          </div>
          <Link to="/about" className="cta-button">{t.ctaButton}</Link>
        </div>
      </section>
      
      <section className="projects-section">
        <h2>{t.projectsTitle}</h2>
        <EventsGrid>
          {upcomingEvents.map((event) => (
            <EventCard 
              key={event.id}
              onClick={() => handleProjectClick(event.url)}
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
                    <ClickIndicator>{eventT?.clickToView || "클릭하여 자세히 보기 →"}</ClickIndicator>
                  )}
                </EventOverlay>
              </PosterContainer>
            </EventCard>
          ))}
        </EventsGrid>
      </section>
    </div>
  );
};

export default Home; 