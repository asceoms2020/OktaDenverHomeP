import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

export const TradingContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8faff;
  font-family: 'Noto Sans KR', sans-serif;
`;

export const ContentWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  background: white;
  padding: 5rem 3rem;
  border-radius: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #4b5563;
  margin-bottom: 3rem;
  line-height: 1.6;
  font-weight: 500;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  display: inline-flex;
  padding: 2rem;
  background: #eff6ff;
  border-radius: 50%;
  color: #3b82f6;
  animation: ${pulse} 2s infinite;
`;

export const InfoText = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;
