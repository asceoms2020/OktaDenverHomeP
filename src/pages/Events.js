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
  AddEventButton
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

    // Case 1: Range "06.29.2024 ~ 06.30.2024" -> Take the END date for "past" check
    if (dateStr.includes('~')) {
      const parts = dateStr.split('~');
      const endDateStr = parts[1].trim();
      return parseSingleDate(endDateStr);
    }

    // Case 2: Single date
    return parseSingleDate(dateStr);
  };

  const parseSingleDate = (dateStr) => {
    // Trim whitespace
    const cleanDateStr = dateStr.trim();

    // Check YYYY.MM.DD (e.g. 2026.12.20)
    const ymdRegex = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;
    const ymdMatch = cleanDateStr.match(ymdRegex);
    if (ymdMatch) {
      return new Date(ymdMatch[1], ymdMatch[2] - 1, ymdMatch[3]);
    }

    // Check MM.DD.YYYY (e.g. 12.20.2026 or 06.28.2025)
    const mdyRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const mdyMatch = cleanDateStr.match(mdyRegex);
    if (mdyMatch) {
      return new Date(mdyMatch[3], mdyMatch[1] - 1, mdyMatch[2]);
    }

    // Check YYYY-MM-DD (ISO)
    const isoRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const isoMatch = cleanDateStr.match(isoRegex);
    if (isoMatch) {
      return new Date(isoMatch[1], isoMatch[2] - 1, isoMatch[3]);
    }

    // Fallback
    const parsed = new Date(cleanDateStr);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  // Fetch and sort events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch all events from Supabase
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false }); // Fetch latest first
          
        if (error) {
          throw error;
        }

        const events = data || [];
        console.log("Fetched Events:", events); // Debug log

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day

        const upcoming = [];
        const past = [];

        events.forEach(event => {
          const eventDate = parseEventDate(event.date);
          
          console.log(`Event: ${event.title}, DateStr: ${event.date}, Parsed: ${eventDate.toDateString()}`); // Debug log

          // If the event date is valid and is today or in the future
          if (eventDate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        // Upcoming: Nearest future date first (Ascending)
        upcoming.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
        
        // Past: Most recent past date first (Descending)
        past.sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);

      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleAddEventClick = () => {
    navigate('/admin');
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
        ) : upcomingEvents.length > 0 ? (
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
