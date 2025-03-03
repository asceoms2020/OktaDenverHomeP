import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
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
  
  p {
    margin-bottom: 2rem;
    word-break: keep-all;
    text-align: justify;
    font-weight: 400;
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