import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AboutContainer,
  Title,
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
  EventsGrid,
  UpcomingSection,
  PastSection,
  EventBadge,
  ClickIndicator,
  PosterContainer,
  AdminActionContainer,
  AddEventButton,
  EditButton
} from '../styles/Events.styles';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../translations/translations';
import { supabase } from '../lib/supabaseClient';

const Events = () => {
  const { language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const t = translations[language]?.events || translations.ko.events;
  
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 언어별 기본값 설정
  const defaultTexts = {
    ko: {
      title: "이벤트",
      upcomingEvents: "다가오는 이벤트", 
      pastEvents: "지난 이벤트",
      clickToView: "클릭하여 자세히 보기 →",
      loading: "이벤트를 불러오는 중입니다...",
      noEvents: "예정된 이벤트가 없습니다.",
      noPastEvents: "지난 이벤트가 없습니다.",
      addEvent: "이벤트 추가 (관리자)"
    },
    en: {
      title: "Events",
      upcomingEvents: "Upcoming Events",
      pastEvents: "Past Events", 
      clickToView: "Click to view details →",
      loading: "Loading events...",
      noEvents: "No upcoming events.",
      noPastEvents: "No past events.",
      addEvent: "Add Event (Admin)"
    }
  };
  
  const defaults = defaultTexts[language] || defaultTexts.ko;

  // Helper function to parse diverse date formats
  const parseEventDate = (dateStr) => {
    if (!dateStr) return new Date(0); // Fallback for invalid dates
    const cleanStr = String(dateStr).trim();

    // Case 1: Range "06.29.2024 ~ 06.30.2024" -> Take the END date for "past" check
    if (cleanStr.includes('~')) {
      const parts = cleanStr.split('~');
      const endDateStr = parts[1].trim();
      return parseEventDate(endDateStr);
    }

    // Normalize delimiters (allow . / -)
    const normalized = cleanStr.replace(/[\/\-]/g, '.');
    const parts = normalized.split('.');

    if (parts.length === 3) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10);
      const p2 = parseInt(parts[2], 10);

      // Simple heuristic: if first part is > 1000, assume YYYY.MM.DD
      if (p0 > 1000) {
        return new Date(p0, p1 - 1, p2);
      }
      // Otherwise assume MM.DD.YYYY (US format)
      else {
        return new Date(p2, p0 - 1, p1);
      }
    }

    // Fallback
    const parsed = new Date(cleanStr);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  // Fetch and sort events
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('events')
          .select('*');
          
        if (error) {
          throw error;
        }

        if (!isMounted) return;

        const events = data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day

        const upcoming = [];
        const past = [];

        events.forEach(event => {
          const dateStr = event.date ? String(event.date) : ''; 
          const eventDate = parseEventDate(dateStr);
          
          // Debug date parsing
          // console.log(`Event: ${event.title}, Parsed: ${eventDate.toISOString()}`);

          // 오늘 날짜 포함해서 미래면 upcoming
          if (eventDate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Upcoming: Nearest future date first (Ascending)
        // 날짜 차이가 양수면 b가 뒤에, 음수면 a가 앞에
        upcoming.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
        
        // Past: Most recent past date first (Descending)
        past.sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date));

        if (isMounted) {
          setUpcomingEvents(upcoming);
          setPastEvents(past);
        }

      } catch (error) {
        console.error("Error fetching events: ", error);
        if (isMounted) {
          setError(error.message || "Failed to load events");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEventClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleAddEventClick = () => {
    navigate('/admin');
  };

  const handleEditClick = (eventId, e) => {
    e.stopPropagation();
    navigate(`/admin?edit=${eventId}`);
  };

  return (
    <AboutContainer>
      <Title>{t?.title || defaults.title}</Title>
      
      {/* 관리자 전용: 이벤트 추가 버튼 */}
      {isAdmin && (
        <AdminActionContainer>
          <AddEventButton onClick={handleAddEventClick}>
            {defaults.addEvent}
          </AddEventButton>
        </AdminActionContainer>
      )}
      
      {/* 다가오는 이벤트 섹션 */}
      <UpcomingSection>
        <SectionTitle>{t?.upcomingEvents || defaults.upcomingEvents}</SectionTitle>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem' }}>
            {defaults.loading}
          </p>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>{error}</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              (Tip: Check if your Supabase project is Paused in the dashboard)
            </p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <EventsGrid>
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id}
                onClick={() => handleEventClick(event.url)}
                $clickable={!!event.url}
              >
                {isAdmin && (
                  <EditButton
                    type="button"
                    onClick={(e) => handleEditClick(event.id, e)}
                    title="Edit"
                    aria-label="Edit event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </EditButton>
                )}
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
        ) : (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem', color: '#666' }}>
            {defaults.noEvents}
          </p>
        )}
      </UpcomingSection>

      {/* 과거 이벤트 섹션 */}
      <PastSection>
        <SectionTitle>{t?.pastEvents || defaults.pastEvents}</SectionTitle>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem' }}>
            {defaults.loading}
          </p>
        ) : pastEvents.length > 0 ? (
          <EventsGrid>
            {pastEvents.map((event) => (
              <EventCard 
                key={event.id}
                onClick={() => handleEventClick(event.url)}
                $clickable={!!event.url}
              >
                {isAdmin && (
                  <EditButton
                    type="button"
                    onClick={(e) => handleEditClick(event.id, e)}
                    title="Edit"
                    aria-label="Edit event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </EditButton>
                )}
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
        ) : (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem', color: '#666' }}>
            {defaults.noPastEvents}
          </p>
        )}
      </PastSection>
    </AboutContainer>
  );
};

export default Events;
