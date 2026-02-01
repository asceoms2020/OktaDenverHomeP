import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지들 import
import main1 from '../assets/images/main/main_1.jpg';
import main2 from '../assets/images/main/main_2.jpg';
import main3 from '../assets/images/main/main_3.jpg';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { supabase } from '../lib/supabaseClient';
import SignUpModal from '../components/SignUpModal';

const Home = () => {
  const { language } = useLanguage();
  // Safety check for translations
  const t = translations?.[language]?.home || {};
  const eventT = translations?.[language]?.events || translations.ko.events;

  // 슬라이더 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const backgroundImages = [main1, main2, main3];

  // 이벤트 데이터 상태 관리
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);

  // 자동 슬라이딩 효과
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [backgroundImages.length]);

  // DB에서 이벤트 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch upcoming events (future dates)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // 다가오는 이벤트 1개 가져오기
        const { data: upcomingData } = await supabase
          .from('events')
          .select('*')
          .gte('date', today) // date >= today
          .order('date', { ascending: true }) // 가장 가까운 미래
          .limit(1);

        if (upcomingData && upcomingData.length > 0) {
          setUpcomingEvent(upcomingData[0]);
        }

        // 지난 이벤트 2개 가져오기 (메인 페이지용)
        const { data: pastData } = await supabase
          .from('events')
          .select('*')
          .lt('date', today) // date < today
          .order('date', { ascending: false }) // 가장 최근 과거
          .limit(2);

        if (pastData) {
          setPastEvents(pastData);
        }

      } catch (error) {
        console.error("Error fetching home events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleProjectClick = (url) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url) {
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
          <div
            className="hero-buttons"
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link to="/mouevent2026" className="cta-button mou-event-cta-button">덴버에서 만나는 세계 참가신청!</Link>
            <Link to="/about" className="cta-button">{t.ctaButton}</Link>
          </div>
        </div>
      </section>

      {upcomingEvent && (
        <section className="projects-section">
          <h2>{t.projectsTitle}</h2>
          <div className="project-main-content">
            <div className="project-poster-section">
              <div
                className="project-poster-container"
                onClick={() => handleProjectClick(upcomingEvent.url)}
              >
                {upcomingEvent.badge && (
                  <div className="project-badge">{upcomingEvent.badge}</div>
                )}
                <img
                  src={upcomingEvent.poster}
                  alt={upcomingEvent.title}
                  className="project-poster"
                />
              </div>
            </div>

            <div className="project-info-section">
              <h3 className="project-main-title">{upcomingEvent.title}</h3>
              <p className="project-subtitle">{t.projectMain?.subtitle}</p>
              <div className="project-date">{upcomingEvent.date}</div>

              <p className="project-description-text" style={{ whiteSpace: 'pre-line' }}>
                {upcomingEvent.description}
              </p>

              {upcomingEvent.url && (
                <a
                  href={upcomingEvent.url}
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
      )}

      {/* 지난 이벤트 섹션 */}
      {pastEvents.length > 0 && (
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
                  {/* Category is not in DB schema currently, defaulting or omitting */}
                  {/* <div className="past-event-category">{event.category}</div> */}
                  <h3 className="past-event-title">{event.title}</h3>
                  <div className="past-event-date">{event.date}</div>
                  <p className="past-event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </div>
  );
};

export default Home;
