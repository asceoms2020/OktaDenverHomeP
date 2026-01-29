import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ResourcesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8faff;
  min-height: 100vh;
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
  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
`;

export const Section = styled.section`
  margin-bottom: 6rem;
  position: relative;
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #111827;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 700;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out 0.2s forwards;
  opacity: 0;

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

export const MOUSection = styled.div`
  display: flex;
  align-items: center;
  gap: 5rem;
  background: #ffffff;
  padding: 5rem;
  border-radius: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 1s ease-out 0.3s forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 35px 60px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 3rem;
    gap: 3rem;
    text-align: center;
  }
`;

export const MOUContent = styled.div`
  flex: 1;
  
  h3 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #4b5563;
    margin-bottom: 2.5rem;
    word-break: keep-all;
  }
`;

export const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    align-items: center; // Center items on mobile
    text-align: left;
  }
`;

export const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: #374151;
  font-weight: 500;
  padding: 0.5rem 0;

  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    color: white;
    border-radius: 50%;
    font-size: 0.9rem;
    font-weight: bold;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
  }
`;

export const WorldMapContainer = styled.div`
  flex: 1.2;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
  background: linear-gradient(145deg, #ffffff, #f0f9ff);
  padding: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    transition: transform 0.5s ease;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05));
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    width: 100%;
    min-height: 300px;
  }
`;
