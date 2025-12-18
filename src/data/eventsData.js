import upcomingEvent1Poster from '../assets/images/event/okta_denver_new_year_2026.png';
import pastEvent4Poster from '../assets/images/event/pastevent4.png';
import pastEvent5Poster from '../assets/images/event/pastevent5.png';

export const eventsData = {
  upcoming: [
    {
      id: 1,
      poster: upcomingEvent1Poster,
      url: "",
      date: "12.20.2025 PM 5:00",
      badge: {
        ko: "Mr. Kim Korean BBQ",
        en: "Mr. Kim Korean BBQ"
      },
      title: {
        ko: "연말 송년회",
        en: "New Year's Eve"
      },
      description: {
        ko: "장소 : Mr. Kim Korean BBQ",
        en: "Location: Mr. Kim Korean BBQ"
      }
    }
  ],
  past: [
    {
      id: 1,
      poster: pastEvent5Poster,
      url: "https://www.zeffy.com/ticketing/3",
      category: {
        ko: "OKTA SEMINAR",
        en: "OKTA SEMINAR"
      },
      title: {
        ko: "제 4회 OKTA 비즈니스 세미나",
        en: "4th OKTA Business Seminar"
      },
      date: {
        ko: "2025년 4차",
        en: "2025 Q4"
      },
      description: {
        ko: "한인 사회의 경제 발전과 성공적인 창업을 돕기 위해 정기적으로 세미나를 개최합니다.",
        en: "We regularly hold seminars to help promote economic development and successful entrepreneurship in the Korean community."
      }
    },
    {
      id: 2,
      poster: pastEvent4Poster,
      url: "https://www.zeffy.com/en-US/ticketing/526bb733-8248-4987-be28-edd572e750c6",
      category: {
        ko: "GOLF TOURNAMENT",
        en: "GOLF TOURNAMENT"
      },
      title: {
        ko: "골프 토너먼트",
        en: "Golf Tournament"
      },
      date: {
        ko: "2024년 3차",
        en: "2024 Q3"
      },
      description: {
        ko: "덴버 멤버들이 정기적으로 골프대회를 개최했습니다.",
        en: "Denver members regularly hosted golf tournaments."
      }
    }
  ]
};
