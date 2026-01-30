import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8faff;
`;

export const Title = styled.h1`
  font-size: 4rem;
  color: #1a1a1a;
  margin-bottom: 4rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
    margin-bottom: 3rem;
  }
`;

export const Content = styled.div`
  max-width: 900px;
  margin: 0 auto 6rem auto;
  text-align: center;
  
  p {
    font-size: 1.3rem;
    line-height: 1.8;
    color: #4b5563;
    font-weight: 400;
    word-break: keep-all;
  }
`;

export const Section = styled.section`
  margin-bottom: 8rem;
  padding: 2rem 0;
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #111827;
  margin-bottom: 4rem;
  text-align: center;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    margin: 1.5rem auto 0;
    border-radius: 3px;
    opacity: 0.8;
  }
`;

/* CEO Section */
export const CEOSection = styled.div`
  display: flex;
  gap: 5rem;
  align-items: center;
  background: #ffffff;
  padding: 5rem;
  border-radius: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.04);
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding: 3rem;
    gap: 3rem;
    text-align: center;
  }
`;

export const CEOImage = styled.img`
  width: 280px;
  height: 280px;
  border-radius: 30px;
  object-fit: cover;
  box-shadow: 20px 20px 0px rgba(59, 130, 246, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const CEOMessage = styled.div`
  flex: 1;
  
  h3 {
    font-size: 2.2rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  
  p {
    font-size: 1.15rem;
    line-height: 1.9;
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

/* Board Section */
export const BoardSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  justify-content: center;
`;

export const BoardMember = styled.div`
  text-align: center;
  background: #ffffff;
  padding: 3rem 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #f3f4f6;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
    border-color: #bfdbfe;
  }
`;

export const BoardImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

export const BoardAvatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 4px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e3a8a;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

export const BoardName = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const BoardPosition = styled.div`
  display: inline-block;
  font-size: 0.95rem;
  color: #2563eb;
  font-weight: 600;
  background: #eff6ff;
  padding: 0.4rem 1rem;
  border-radius: 20px;
`;

/* Reuse unused components just in case, but styled to match */
export const ImageGrid = styled.div``;
export const ImageContainer = styled.div``;
export const Image = styled.img``;
export const ImageCaption = styled.div``;
export const OrgChart = styled.div``;
export const OrgLevel = styled.div``;
export const OrgBox = styled.div``;
export const ServiceGrid = styled.div``;
export const ServiceCard = styled.div``;
export const ServiceIcon = styled.div``;
export const ServiceTitle = styled.div``;
export const ServiceDescription = styled.div``;
export const Timeline = styled.div``;
export const TimelineItem = styled.div``;
export const TimelineYear = styled.div``;
export const TimelineContent = styled.div``; 
