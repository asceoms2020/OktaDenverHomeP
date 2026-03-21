import React from 'react';
import {
  PageWrapper,
  HeroSection,
  OrganizerLabel,
  HeroTitle,
  HeroSubtitle,
  HeroMeta,
  HeroMetaItem,
  ScrollHint,
  ContentSection,
  SectionTitle,
  ScheduleContainer,
  DayCard,
  DayLabel,
  DayActivities,
  ActivityItem,
  FeeSection,
  FeeGrid,
  FeeCard,
  FeeAmount,
  FeeLabel,
  DeadlineBanner,
  DeadlineText,
  ContactSection,
  ContactItem,
  RegisterButton,
  Divider,
} from '../styles/MouEvent2026Info.styles';

const MouEvent2026Info = () => {

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <OrganizerLabel>월드 옥타 덴버지회 주최</OrganizerLabel>
        <HeroTitle>
          글로벌 자매지회초청<br />비즈니스 포럼
        </HeroTitle>
        <HeroSubtitle>Connect, Share, Grow Together</HeroSubtitle>
        <HeroMeta>
          <HeroMetaItem>
            <span>일시:</span> 2026. 06. 25(목) — 06. 27(토)
          </HeroMetaItem>
          <HeroMetaItem>
            <span>장소:</span> 더블트리바이힐튼 덴버-오로라
          </HeroMetaItem>
        </HeroMeta>
        <ScrollHint>scroll</ScrollHint>
      </HeroSection>

      {/* Main Content */}
      <ContentSection>

        {/* Schedule */}
        <SectionTitle>행사 일정</SectionTitle>
        <ScheduleContainer>
          <DayCard $delay="0.1s">
            <DayLabel>6월 25일 (목)</DayLabel>
            <DayActivities>
              <ActivityItem>개회식 및 환영 만찬</ActivityItem>
            </DayActivities>
          </DayCard>

          <DayCard $delay="0.2s">
            <DayLabel>6월 26일 (금)</DayLabel>
            <DayActivities>
              <ActivityItem>글로벌 비지니스 포럼</ActivityItem>
              <ActivityItem>친선 골프 / Arrowhead Golf Club</ActivityItem>
              <ActivityItem>기차 여행 / Pikes Peak Cog Trail</ActivityItem>
            </DayActivities>
          </DayCard>

          <DayCard $delay="0.3s">
            <DayLabel>6월 27일 (토)</DayLabel>
            <DayActivities>
              <ActivityItem>글로벌 지회간 교류회 및 콜로라도 관광</ActivityItem>
            </DayActivities>
          </DayCard>
        </ScheduleContainer>

        <Divider />

        {/* Fee */}
        <SectionTitle>참가비</SectionTitle>
        <FeeSection>
          <FeeGrid>
            <FeeCard>
              <FeeAmount>$300</FeeAmount>
              <FeeLabel>2인 1실</FeeLabel>
            </FeeCard>
            <FeeCard>
              <FeeAmount>$400</FeeAmount>
              <FeeLabel>1인 1실</FeeLabel>
            </FeeCard>
            <FeeCard>
              <FeeAmount>$200</FeeAmount>
              <FeeLabel>친선 골프</FeeLabel>
            </FeeCard>
            <FeeCard>
              <FeeAmount>$75</FeeAmount>
              <FeeLabel>기차 여행</FeeLabel>
            </FeeCard>
          </FeeGrid>
        </FeeSection>

        <Divider />

        {/* Deadline */}
        <DeadlineBanner>
          <DeadlineText>
            신청 마감일
            <span>2026년 4월 2일</span>
          </DeadlineText>
        </DeadlineBanner>

        {/* Contact */}
        <SectionTitle>문의 및 신청</SectionTitle>
        <ContactSection>
          <ContactItem>
            <span className="label">문의사항</span>
            <span>박수정 부회장 — 1-303-564-9327</span>
          </ContactItem>
          <ContactItem>
            <span className="label">카카오톡</span>
            <span>soo park</span>
          </ContactItem>
        </ContactSection>

        {/* Register CTA */}
        <RegisterButton onClick={() => window.open('https://forms.gle/uWewVQrGKK4D9fa8A', '_blank')} as="button"
          style={{ cursor: 'pointer', border: 'none' }}>
          참가 신청하기
        </RegisterButton>

      </ContentSection>
    </PageWrapper>
  );
};

export default MouEvent2026Info;
