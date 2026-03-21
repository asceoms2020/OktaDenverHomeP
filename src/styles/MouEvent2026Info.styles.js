import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0a1f0f;
  font-family: 'Noto Sans KR', sans-serif;
`;

// Hero Section
export const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  max-height: 900px;
  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(5, 30, 10, 0.6) 60%,
      rgba(5, 25, 8, 0.92) 100%
    ),
    url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&auto=format&fit=crop')
    center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
`;

export const OrganizerLabel = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.8s ease both;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.2;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.9s ease 0.1s both;
  word-break: keep-all;
`;

export const HeroSubtitle = styled.p`
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.06em;
  margin-bottom: 2.5rem;
  animation: ${fadeInUp} 0.9s ease 0.2s both;
  font-style: italic;
`;

export const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: ${fadeInUp} 0.9s ease 0.3s both;
`;

export const HeroMetaItem = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;

  span {
    color: #7ddc8f;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  animation: ${fadeInUp} 1s ease 0.8s both;

  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
  }
`;

// Content Section
export const ContentSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 5rem 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #7ddc8f;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 1.8rem;
    background: linear-gradient(to bottom, #7ddc8f, #2ecc71);
    border-radius: 3px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Schedule
export const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 5rem;
`;

export const DayCard = styled.div`
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(125, 220, 143, 0.2);
  border-left: 4px solid #7ddc8f;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${props => props.$delay || '0s'};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const DayLabel = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #7ddc8f;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const DayActivities = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ActivityItem = styled.li`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  line-height: 1.6;
  padding-left: 1.2rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #7ddc8f;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

// Fee Section
export const FeeSection = styled.div`
  background: linear-gradient(135deg, rgba(125, 220, 143, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%);
  border: 1px solid rgba(125, 220, 143, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const FeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const FeeCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(125, 220, 143, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(125, 220, 143, 0.5);
  }
`;

export const FeeAmount = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #7ddc8f;
  margin-bottom: 0.4rem;

  background: linear-gradient(90deg, #7ddc8f, #2ecc71, #7ddc8f);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3s linear infinite;
`;

export const FeeLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

// Deadline Banner
export const DeadlineBanner = styled.div`
  background: linear-gradient(135deg, #c0392b, #e74c3c);
  border-radius: 16px;
  padding: 1.8rem 2.5rem;
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  text-align: center;
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.35);
`;

export const DeadlineText = styled.p`
  color: white;
  font-size: 1.2rem;
  font-weight: 700;

  span {
    font-size: 1.5rem;
    display: block;
    margin-top: 0.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Contact Section
export const ContactSection = styled.div`
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #7ddc8f;
    font-weight: 700;
    min-width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`;

// Register Button
export const RegisterButton = styled.a`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  text-align: center;
  padding: 1.3rem 2rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
  transition: all 0.3s ease;
  letter-spacing: 0.03em;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(46, 204, 113, 0.5);
    background: linear-gradient(135deg, #27ae60, #1e8449);
  }

  @media (max-width: 768px) {
    font-size: 1.05rem;
    padding: 1.1rem 1.5rem;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 4rem 0;
`;
