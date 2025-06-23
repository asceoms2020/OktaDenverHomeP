import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지 import
import mainBg from '../assets/images/home/golf.jpg';
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
import { upcomingEvents } from './Events';

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language].home;

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
      <section 
        className="hero-section hero-section-background" 
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                      url(${mainBg}) no-repeat center center`
        }}
      >
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
                    <ClickIndicator>클릭하여 자세히 보기 →</ClickIndicator>
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