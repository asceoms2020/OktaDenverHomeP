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
        지역 사회에 한국 문화를 소개하고 체험함으로써 미국 내 한국 문화에 대한 인식을 지속적으로 제고해
        나갈 것입니다. 청년 세대 직업 학교와 같은 체계적인 프로그램을 통해 젊은 세대를 교육하고, 커리어
        창업 아카데미를 통해 지역 사회 구성원과 일반 회원을 지원합니다. OKTA 회원들이 경제적, 사회적,
        그리고 개인적 성공을 향한 여정을 함께할 수 있도록 국내외 네트워킹 기회를 제공합니다.
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
            안녕하십니까.
            세계한인무역협회(OKTA) 덴버지회 홈페이지를 방문해주신 여러분께
            진심으로 환영의 인사를 드립니다.
            덴버지회는 전 세계 한인 경제인들과 연결된 글로벌 네트워크의
            일원이자, 비영리단체로서 한인 경제인의 권익 증진과 상호 협력, 그리고
            지속 가능한 성장을 도모하고자 다양한 활동을 펼치고 있습니다. 저희는
            무역과 투자, 비즈니스 협력 촉진을 위해 네트워킹, 멘토링, 파트너십
            기회를 적극 제공하고 있습니다.
            특히, 지역 한인 경제인들이 글로벌 시장과 연결될 수 있도록 가교
            역할을 수행함과 동시에, 차세대 한인 리더들을 육성하는 교육과 멘토링
            프로그램에도 힘을 쏟고 있습니다.
            비영리단체로서의 사명을 바탕으로, 덴버지회는 지식 공유, 커뮤니티
            지원, 교육 기회 확대를 통해 지역 사회에 실질적인 기여를 하고자
            합니다. 회원 여러분의 지속적인 참여와 관심 속에, 함께 성장하고
            발전하는 공동체로 나아가겠습니다.
            감사합니다.
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
            세계한인무역협회(OKTA) 덴버지회장
            <br/>
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