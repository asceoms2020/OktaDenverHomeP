import styled, { keyframes, css } from 'styled-components';

export const SponsorsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8faff;
`;

export const PremiumSection = styled.section`
  margin-bottom: 6rem;
`;

export const RegularSection = styled.section`
  margin-bottom: 6rem;
`;

export const SponsorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

export const SponsorCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  height: 100%;

  ${props => props.premium && css`
    border: 2px solid #3b82f6;
    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.15);
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
`;

export const LogoContainer = styled.div`
  height: 180px;
  background: ${props => props.premium ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' : '#f8fafc'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-bottom: 1px solid #edf2f7;
`;

export const SponsorLogo = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  ${SponsorCard}:hover & {
    transform: scale(1.05);
  }
`;

export const SponsorContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CompanyInfo = styled.div`
  margin-bottom: 1rem;
`;

export const SponsorName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

export const SponsorCategory = styled.span`
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 600;
  background: #eff6ff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`;

export const SponsorDescription = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
`;

export const ContactInfo = styled.div`
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
`;

export const SponsorWebsite = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ClickIndicator = styled.div`
  font-size: 0.85rem;
  color: #3b82f6;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  font-weight: 600;

  ${SponsorCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SponsorBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
  z-index: 10;
`;

/* Empty Slot Styles */
export const EmptySlot = styled.div`
  border: 2px dashed #cbd5e0;
  border-radius: 20px;
  height: 300px; /* Fixed height for visual consistency */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #a0aec0;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
    color: #3b82f6;
    transform: translateY(-5px);
  }
  
  &::before {
    content: '+';
    font-size: 4rem;
    font-weight: 200;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  span {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  small {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0.8;
  }
`;

/* Call for Sponsors Section */
export const RecruitmentSection = styled.div`
  text-align: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
  margin-top: 6rem;
  border: 1px solid #edf2f7;
  
  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a202c;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #1a202c 0%, #4a5568 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.2rem;
    color: #4a5568;
    line-height: 1.8;
    margin-bottom: 3rem;
  }
`;

export const ContactButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
`; 