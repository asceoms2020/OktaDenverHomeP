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
import pastEvent4Poster from '../assets/images/event/pastevent4.png';
import pastEvent5Poster from '../assets/images/event/pastevent5.png';

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
    }
  ];

  // 지난 이벤트 데이터 (Home에서 사용)
  const pastEvents = [
    {
      id: 1,
      category: t.pastEventsSection?.events?.[0]?.category || "OKTA SEMINAR",
      title: t.pastEventsSection?.events?.[0]?.title || "제 4회 OKTA 비즈니스 세미나",
      date: t.pastEventsSection?.events?.[0]?.date || "2025년 4차",
      description: t.pastEventsSection?.events?.[0]?.description || "한인 사회의 경제 발전과 성공적인 창업을 돕기 위해 정기적으로 세미나를 개최합니다.",
      poster: pastEvent5Poster,
      url: "https://www.zeffy.com/ticketing/3"
    },
    {
      id: 2,
      category: t.pastEventsSection?.events?.[1]?.category || "GOLF TOURNAMENT",
      title: t.pastEventsSection?.events?.[1]?.title || "골프 토너먼트",
      date: t.pastEventsSection?.events?.[1]?.date || "2024년 3차",
      description: t.pastEventsSection?.events?.[1]?.description || "덴버 멤버들이 정기적으로 골프대회를 개최했습니다.",
      poster: pastEvent4Poster,
      url: "https://www.zeffy.com/en-US/ticketing/526bb733-8248-4987-be28-edd572e750c6"
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
        <div className="project-main-content">
          <div className="project-poster-section">
            <div 
              className="project-poster-container"
              onClick={() => handleProjectClick(upcomingEvents[0]?.url)}
            >
              {upcomingEvents[0]?.badge && (
                <div className="project-badge">{upcomingEvents[0].badge}</div>
              )}
              <img 
                src={upcomingEvents[0]?.poster} 
                alt={upcomingEvents[0]?.title}
                className="project-poster"
              />
            </div>
          </div>
          
          <div className="project-info-section">
            <h3 className="project-main-title">{upcomingEvents[0]?.title}</h3>
            <p className="project-subtitle">{t.projectMain?.subtitle}</p>
            <div className="project-date">{upcomingEvents[0]?.date}</div>
            
            <ul className="project-description-list">
              {t.projectMain?.description?.map((item, index) => (
                <li key={index} className="project-description-item">
                  <span className="project-bullet">●</span>
                  <span className="project-description-text">{item}</span>
                </li>
              ))}
            </ul>
            
            {upcomingEvents[0]?.url && (
              <a 
                href={upcomingEvents[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-cta-button"
              >
                {eventT?.clickToView || "클릭하여 자세히 보기 →"}
              </a>
            )}
          </div>
        </div>
      </section>
      
      {/* 지난 이벤트 섹션 */}
      <section className="past-events-section">
        <h2>{t.pastEventsSection?.title || "지난 주요 행사"}</h2>
        <div className="past-events-grid">
          {pastEvents.map((event) => (
            <div 
              key={event.id}
              className="past-event-item"
              onClick={() => handleProjectClick(event.url)}
            >
              <div className="past-event-poster-section">
                <div className="past-event-poster-container">
                  <img 
                    src={event.poster} 
                    alt={event.title}
                    className="past-event-poster"
                  />
                </div>
              </div>
              
              <div className="past-event-info-section">
                <div className="past-event-category">{event.category}</div>
                <h3 className="past-event-title">{event.title}</h3>
                <div className="past-event-date">{event.date}</div>
                <p className="past-event-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 