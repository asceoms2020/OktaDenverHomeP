import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 0 16px rgba(16, 185, 129, 0); }
`;

export const TradingContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ecfdf5 50%, #eff6ff 100%);
  font-family: 'Noto Sans KR', sans-serif;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  background: #ffffff;
  max-width: 560px;
  width: 100%;
  border-radius: 28px;
  padding: 4rem 3rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
  text-align: center;
  animation: ${fadeIn} 0.7s ease-out both;

  @media (max-width: 600px) {
    padding: 3rem 1.75rem;
    border-radius: 20px;
  }
`;

export const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.12),
    rgba(59, 130, 246, 0.1)
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
  animation: ${pulse} 2.4s ease-in-out infinite;
`;

export const Title = styled.h1`
  color: #0f172a;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

export const Subtitle = styled.p`
  color: #10b981;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  word-break: keep-all;
`;

export const InfoText = styled.p`
  color: #64748b;
  font-size: 0.975rem;
  line-height: 1.8;
  max-width: 400px;
  margin: 0 auto;
`;
