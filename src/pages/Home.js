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
import { eventsData } from '../data/eventsData';

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

  const handleProjectClick = (url) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url) {
      window.location.href = url;
    }
  };

  const currentUpcomingEvent = eventsData.upcoming[0];

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
              onClick={() => handleProjectClick(currentUpcomingEvent?.url)}
            >
              {currentUpcomingEvent?.badge?.[language] && (
                <div className="project-badge">{currentUpcomingEvent.badge[language]}</div>
              )}
              <img 
                src={currentUpcomingEvent?.poster} 
                alt={currentUpcomingEvent?.title?.[language]}
                className="project-poster"
              />
            </div>
          </div>
          
          <div className="project-info-section">
            <h3 className="project-main-title">{currentUpcomingEvent?.title?.[language]}</h3>
            <p className="project-subtitle">{t.projectMain?.subtitle}</p>
            <div className="project-date">{currentUpcomingEvent?.date}</div>
            
            <p className="project-description-text" style={{ whiteSpace: 'pre-line' }}>
              {currentUpcomingEvent?.description?.[language]}
            </p>
            
            {currentUpcomingEvent?.url && (
              <a 
                href={currentUpcomingEvent.url}
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
          {eventsData.past.map((event) => (
            <div 
              key={event.id}
              className="past-event-item"
              onClick={() => handleProjectClick(event.url)}
            >
              <div className="past-event-poster-section">
                <div className="past-event-poster-container">
                  <img 
                    src={event.poster} 
                    alt={event.title[language]}
                    className="past-event-poster"
                  />
                </div>
              </div>
              
              <div className="past-event-info-section">
                <div className="past-event-category">{event.category[language]}</div>
                <h3 className="past-event-title">{event.title[language]}</h3>
                <div className="past-event-date">{event.date[language]}</div>
                <p className="past-event-description">{event.description[language]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 