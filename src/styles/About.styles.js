import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #ffffff;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  color: #1a1a1a;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Content = styled.div`
  line-height: 2;
  color: #333333;
  font-size: 1.2rem;
  margin-bottom: 4rem;
  
  p {
    margin-bottom: 2rem;
    word-break: keep-all;
    text-align: justify;
    font-weight: 400;
  }
`;

export const Section = styled.section`
  margin-bottom: 6rem;
  padding: 2rem 0;
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    margin: 1rem auto;
    border-radius: 2px;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageContainer = styled.div`
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #fff;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ImageCaption = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: #444;
  font-weight: 500;
`;

/* CEO Section */
export const CEOSection = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const CEOImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

export const CEOMessage = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 1rem;
  }
`;

/* Board Section */
export const BoardSection = styled.div`
  background-color: #fff;
`;

export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

export const BoardMember = styled.div`
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

export const BoardImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #e9ecef;
`;

export const BoardName = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const BoardPosition = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  font-weight: 500;
`;

/* Organization Chart */
export const OrgChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 20px;
  color: white;
`;

export const OrgLevel = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const OrgBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 2rem;
  border-radius: 15px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 150px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
`;

/* Services Section */
export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

export const ServiceCard = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(52, 152, 219, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
  }
`;

export const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

export const ServiceTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

export const ServiceDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
`;

/* Timeline */
export const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #3498db, #2ecc71);
    border-radius: 2px;
  }
`;

export const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 3rem;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 0;
    width: 20px;
    height: 20px;
    background: #3498db;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 0 0 4px #3498db;
  }
`;

export const TimelineYear = styled.div`
  display: inline-block;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

export const TimelineContent = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #3498db;
  
  h4 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
  }
`; 