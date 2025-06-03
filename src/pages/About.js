import React from 'react';
import {
  AboutContainer,
  Title,
  Content,
  Section,
  SectionTitle,
  ImageGrid,
  ImageContainer,
  Image,
  ImageCaption,
  CEOSection,
  CEOImage,
  CEOMessage,
  BoardSection,
  BoardGrid,
  BoardMember,
  BoardImage,
  BoardName,
  BoardPosition,
  OrgChart,
  OrgLevel,
  OrgBox,
  ServiceGrid,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  Timeline,
  TimelineItem,
  TimelineYear,
  TimelineContent
} from '../styles/About.styles';

const About = () => {
  return (
    <AboutContainer>
      <Title>Okta Denver에 오신 것을 환영합니다</Title>
      
      {/* 회사 소개 */}
      <Content>
        <p>
          한국 OKTA 덴버는 미국 콜로라도 주에서 활동하는 한인 경제인들의 
          모임입니다. 우리는 한인 기업인들의 성공적인 미국 시장 진출과 
          사업 성장을 지원하며, 회원들 간의 네트워킹과 정보 교류를 통해 
          상호 발전을 도모하고 있습니다.
        </p>
      </Content>

      {/* 회장님 인사말 */}
      <Section>
        <SectionTitle>회장님 인사말</SectionTitle>
        <CEOSection>
          <CEOImage src="/images/ceo-photo.jpg" alt="회장님" />
          <CEOMessage>
            <h3>최준경 회장</h3>
            <p>
              안녕하세요, Okta Denver의 가족 여러분과 파트너 여러분께 인사드립니다.
            </p>
            <p>
              회장님인사말
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
              - 최준경 회장 드림
            </p>
          </CEOMessage>
        </CEOSection>
      </Section>

      {/* 보드멤버 */}
      <Section>
        <SectionTitle>보드멤버</SectionTitle>
        <BoardSection>
          <BoardGrid>
            <BoardMember>
              <BoardImage src="/images/board1.jpg" alt="이사" />
              <BoardName>박수정</BoardName>
              <BoardPosition>부회장</BoardPosition>
            </BoardMember>
            <BoardMember>
              <BoardImage src="/images/board2.jpg" alt="이사" />
              <BoardName>신윤주</BoardName>
              <BoardPosition>부회장</BoardPosition>
            </BoardMember>
            <BoardMember>
              <BoardImage src="/images/board3.jpg" alt="이사" />
              <BoardName>이승우</BoardName>
              <BoardPosition>이사장</BoardPosition>
            </BoardMember>
            <BoardMember>
              <BoardImage src="/images/board4.jpg" alt="이사" />
              <BoardName>신동윤</BoardName>
              <BoardPosition>감사이사</BoardPosition>
            </BoardMember>
            <BoardMember>
              <BoardImage src="/images/board5.jpg" alt="이사" />
              <BoardName>김소연</BoardName>
              <BoardPosition>재무이사</BoardPosition>
            </BoardMember>
          </BoardGrid>
        </BoardSection>
      </Section>

      {/* 조직도 */}
      <Section>
        <SectionTitle>조직도</SectionTitle>
        <OrgChart>
          <OrgLevel>
            <OrgBox>회장<br/>최준겸</OrgBox>
          </OrgLevel>
          <OrgLevel>
            <OrgBox>기획운영위원회<br/>박수정,박수영</OrgBox>
            <OrgBox>행사진행위원회<br/>권민영</OrgBox>
            <OrgBox>홍보위원회<br/>김은주,김경숙</OrgBox>
            <OrgBox>차세대위원회<br/>윤정민</OrgBox>
          </OrgLevel>
        </OrgChart>
      </Section>

      {/* 하는 일 */}
      <Section>
        <SectionTitle>하는 일</SectionTitle>
        <ServiceGrid>
          <ServiceCard>
            <ServiceIcon>🔐</ServiceIcon>
            <ServiceTitle>신원 관리</ServiceTitle>
            <ServiceDescription>
              통합된 신원 관리 솔루션으로 사용자 인증과 권한 관리를 
              간편하고 안전하게 제공합니다.
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard>
            <ServiceIcon>🛡️</ServiceIcon>
            <ServiceTitle>보안 솔루션</ServiceTitle>
            <ServiceDescription>
              다중 인증과 위험 기반 인증을 통해 기업의 디지털 자산을 
              보호하는 강력한 보안 서비스를 제공합니다.
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard>
            <ServiceIcon>🌐</ServiceIcon>
            <ServiceTitle>클라우드 통합</ServiceTitle>
            <ServiceDescription>
              다양한 클라우드 서비스와의 원활한 통합을 통해 
              하이브리드 환경에서의 신원 관리를 지원합니다.
            </ServiceDescription>
          </ServiceCard>
          <ServiceCard>
            <ServiceIcon>📊</ServiceIcon>
            <ServiceTitle>분석 & 리포팅</ServiceTitle>
            <ServiceDescription>
              상세한 분석과 리포팅 기능을 통해 보안 현황을 
              실시간으로 모니터링하고 관리할 수 있습니다.
            </ServiceDescription>
          </ServiceCard>
        </ServiceGrid>
      </Section>

      {/* History */}
      <Section>
        <SectionTitle>연혁</SectionTitle>
        <Timeline>
          <TimelineItem>
            <TimelineYear>2024</TimelineYear>
            <TimelineContent>
              <h4>한국 시장 진출</h4>
              <p>Okta Denver 한국 지사 설립 및 본격적인 한국 시장 진출</p>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineYear>2023</TimelineYear>
            <TimelineContent>
              <h4>아시아 태평양 확장</h4>
              <p>아시아 태평양 지역으로의 사업 확장 및 파트너십 구축</p>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineYear>2022</TimelineYear>
            <TimelineContent>
              <h4>기술 혁신상 수상</h4>
              <p>혁신적인 신원 관리 솔루션으로 기술 혁신상 수상</p>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineYear>2021</TimelineYear>
            <TimelineContent>
              <h4>Okta Denver 설립</h4>
              <p>덴버 지역에 Okta 지사 설립 및 운영 시작</p>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Section>

      {/* 사무실 이미지 */}
      <Section>
        <SectionTitle>우리의 공간</SectionTitle>
        <ImageGrid>
          <ImageContainer>
            <Image src="/images/denver-office1.jpg" alt="Okta 덴버 사무실 전경" />
            <ImageCaption>현대적인 Okta 덴버 사무실</ImageCaption>
          </ImageContainer>
          <ImageContainer>
            <Image src="/images/denver-team.jpg" alt="Okta 덴버 팀" />
            <ImageCaption>열정적인 Okta 덴버 팀</ImageCaption>
          </ImageContainer>
          <ImageContainer>
            <Image src="/images/denver-culture.jpg" alt="Okta 덴버 문화" />
            <ImageCaption>혁신적인 기업 문화</ImageCaption>
          </ImageContainer>
        </ImageGrid>
      </Section>
    </AboutContainer>
  );
};

export default About; 